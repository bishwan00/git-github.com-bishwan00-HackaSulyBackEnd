import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/usermodels.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.create({
          email,
          password,
          userName: req.body.userName,
          phoneNumber: req.body.phoneNumber,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          city: req.body.city,
          gender: req.body.gender,
        });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email,
        });

        if (!user) {
          return done(null, false, { message: "invalid Credential" });
        }

        const validate = await user.isValidePassword(password);
        if (!validate)
          return done(null, false, { message: "invalid Credential" });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
passport.use(
  "loginAdmin",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email,
        });

        if (!user) {
          return done(null, false, { message: "invalid Credential" });
        }
        if (user.role !== "admin") {
          return done(null, false, { message: "invalid Credential" });
        }

        const validate = await user.isValidePassword(password);
        if (!validate)
          return done(null, false, { message: "invalid Credential" });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
