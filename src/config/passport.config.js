import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserModel } from "../models/user.model.js";
import { CartModel } from "../models/cart.model.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { JWT_SECRET } from "./config.js";

export const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
        session: false,
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age, role } = req.body;

          const userExist = await UserModel.findOne({ email });
          if (userExist) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          const cart = await CartModel.create({ products: [] });

          const hashedPassword = createHash(password);

          const user = await UserModel.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: cart._id,
            role: role || "user",
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Invalid password" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // JWT strategy for "current"
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await UserModel.findById(jwtPayload.user.id).select(
            "-password"
          );
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};
