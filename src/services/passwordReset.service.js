import crypto from "crypto";
import bcrypt from "bcrypt";

import { createHash } from "../utils/hash.js";
import { APP_URL } from "../env.js";
import { sendEmail } from "../utils/mailer.js";
import { passwordResetRepository } from "../repositories/passwordReset.repository.js";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

const createResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return {
    token,
    tokenHash: passwordResetRepository.hashToken(token),
  };
};

export const requestPasswordReset = async ({ email }) => {
  // No revelar si el email existe para evitar enumeración.
  const user = await passwordResetRepository.findUserByEmail(email);
  if (!user) return { sent: false };

  const { token, tokenHash } = createResetToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await passwordResetRepository.setResetTokenHash({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  const resetUrl = `${APP_URL}/api/sessions/reset-password/${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Restablecer contraseña</h2>
      <p>Presiona el botón para cambiar tu contraseña. El enlace expira en 1 hora.</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">
        Restablecer contraseña
      </a>
      <p style="font-size:12px;color:#666;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Recuperación de contraseña",
    html,
  });

  return { sent: true };
};

export const validateResetToken = async (token) => {
  const tokenHash = passwordResetRepository.hashToken(token);
  return passwordResetRepository.findUserByValidResetTokenHash({ tokenHash });
};

export const resetPassword = async ({ token, password }) => {
  const user = await validateResetToken(token);
  if (!user) {
    const err = new Error("El enlace de recuperación es inválido o expiró.");
    err.status = 400;
    throw err;
  }

  const matchesCurrent = bcrypt.compareSync(password, user.password);
  const matchesPrevious =
    user.previousPasswordHash &&
    bcrypt.compareSync(password, user.previousPasswordHash);

  if (matchesCurrent || matchesPrevious) {
    const err = new Error(
      "No puedes reutilizar la contraseña anterior. Elige otra."
    );
    err.status = 400;
    throw err;
  }

  const newPasswordHash = createHash(password);
  const previousPasswordHash = user.password;

  await passwordResetRepository.invalidateTokenAndSetPassword({
    userId: user._id,
    newPasswordHash,
    previousPasswordHash,
  });
};

