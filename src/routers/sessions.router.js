import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env.js";
import { toUserDTO } from "../dtos/user.dto.js";
import {
  requestPasswordReset,
  resetPassword,
  validateResetToken,
} from "../services/passwordReset.service.js";

const router = Router();

const wantsHtml = (req) => {
  const accept = req.headers?.accept || "";
  return accept.includes("text/html");
};

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  (req, res) => {
    const user = req.user;
    res.status(201).json({
      status: "success",
      payload: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart,
      },
    });
  }
);

router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: info?.message || "Authentication failed",
      });
    }

    const token = jwt.sign(
      {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      status: "success",
      token,
    });
  })(req, res, next);
});

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    // req.user viene de la estrategia JWT (sin password), pero igual mapeamos a DTO seguro.
    const userDTO = toUserDTO(req.user);
    res.json({
      status: "success",
      user: userDTO,
    });
  }
);

router.get("/forgot-password", (req, res) => {
  if (!wantsHtml(req)) {
    return res
      .status(406)
      .json({ status: "error", message: "Not Acceptable" });
  }

  return res.render("forgot-password");
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body || {};
    // Respuesta genérica para evitar enumeración de usuarios.
    await requestPasswordReset({ email });

    if (wantsHtml(req)) {
      return res.render("forgot-password-sent");
    }

    return res.json({
      status: "success",
      message:
        "Si existe una cuenta con ese email, recibirás un correo de recuperación.",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/reset-password/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await validateResetToken(token);

    if (!user) {
      if (wantsHtml(req)) {
        return res.status(400).render("error", {
          message: "El enlace es inválido o expiró.",
        });
      }

      return res.status(400).send("El enlace es inválido o expiró.");
    }

    if (!wantsHtml(req)) {
      return res.status(406).json({
        status: "error",
        message: "Not Acceptable",
      });
    }

    return res.status(200).render("reset-password", { token });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body || {};

    if (!password) {
      return res.status(400).json({
        status: "error",
        message: "La contraseña es requerida.",
      });
    }

    await resetPassword({ token, password });

    if (wantsHtml(req)) {
      return res.render("reset-password-success");
    }

    return res.json({
      status: "success",
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;

