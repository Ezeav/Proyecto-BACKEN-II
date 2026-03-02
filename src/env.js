import dotenv from "dotenv";

dotenv.config();

export const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/proyectoBackend2";
export const JWT_SECRET = process.env.JWT_SECRET || "supersecretojwt";
export const PORT = process.env.PORT || 8080;
