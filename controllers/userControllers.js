import User from "../models/usermodels.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import customError from "../utilts/customError.js";
import { tryCatch } from "../utilts/tryCatch.js";

export const signup = async (req, res) => {
  try {
    req.login(req.user, { session: false }, async (error) => {
      if (error) return next(error);

      const body = { sub: req.user._id, email: req.user.email };
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
        expiresIn: "7 days",
      });
      res
        .status(200)
        .json({ status: "success", data: { user: req.body, token } });
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

export const getUser = tryCatch(async (req, res) => {
  const user = await User.find();

  if (!user) {
    throw new customError("no users found", 400);
  }
  res.status(201).json({ status: "success", data: user });
});

export const login = (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        //throw yaksar acheta catchaka
        throw new customError("no user found", 404);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { sub: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: "7 days",
        });
        res.json({ user, token });
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
};

export const loginAdmin = (req, res, next) => {
  passport.authenticate("loginAdmin", async (err, user, info) => {
    try {
      if (err || !user) {
        //throw yaksar acheta catchaka
        throw new customError("no user found", 404);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { sub: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: "7 days",
        });
        res.json({ user, token });
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
};
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub);

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res.status(401).json({ status: "error", message: error });
  }
};
