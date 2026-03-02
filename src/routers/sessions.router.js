import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env.js";

const router = Router();

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
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // req.user viene de la estrategia JWT (sin password)
    res.json({
      status: "success",
      user: req.user,
    });
  }
);

export default router;
