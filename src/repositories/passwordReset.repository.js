import crypto from "crypto";

import { UserDAO } from "../dao/user.dao.js";

const userDAO = new UserDAO();

const sha256Hex = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

export const passwordResetRepository = {
  findUserByEmail: async (email) => userDAO.findByEmail(email),

  // tokenHash ya debe venir como sha256 del token en crudo.
  setResetTokenHash: async ({ userId, tokenHash, expiresAt }) =>
    userDAO.setPasswordResetToken(userId, tokenHash, expiresAt),

  // Retorna el user para poder validar password contra el hash actual/anterior.
  findUserByValidResetTokenHash: async ({ tokenHash }) => {
    const now = new Date();
    return userDAO.findByResetTokenHash(tokenHash, now);
  },

  // También invalida el token (one-time).
  invalidateTokenAndSetPassword: async ({
    userId,
    newPasswordHash,
    previousPasswordHash,
  }) =>
    userDAO.resetPasswordAndInvalidateToken({
      userId,
      newPasswordHash,
      previousPasswordHash,
    }),

  hashToken: sha256Hex,
};

