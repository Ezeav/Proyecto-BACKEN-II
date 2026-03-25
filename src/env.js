import dotenv from "dotenv";

dotenv.config();

export const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/proyectoBackend2";
export const JWT_SECRET = process.env.JWT_SECRET || "supersecretojwt";
export const PORT = process.env.PORT || 8080;

// Mailing (SMTP)
export const SMTP_HOST = process.env.SMTP_HOST || "";
export const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
export const SMTP_USER = process.env.SMTP_USER || "";
export const SMTP_PASS = process.env.SMTP_PASS || "";
export const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER;

// URL pública base para construir links
export const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
