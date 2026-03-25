import nodemailer from "nodemailer";
import {
  MAIL_FROM,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_USER,
} from "../env.js";

export const createTransporter = () => {
  // Si no hay configuración SMTP, fallará con un error claro al enviar.
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // common convention for SMTPS
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    html,
  });
};

