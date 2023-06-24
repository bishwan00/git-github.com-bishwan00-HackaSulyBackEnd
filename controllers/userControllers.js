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

export const getUsersWinner = async (req, res) => {
  try {
    let query = JSON.stringify(req.query);

    //ama bo awaya la req.query kaya bysrynawa boy find ka eshkat
    let excluteQuery = ["limit"];
    //bo nwsyny gte ...
    query = query.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    let queryObj = JSON.parse(query);
    excluteQuery.forEach((i) => {
      delete queryObj[i];
    });

    const getQuery = User.find(queryObj).sort({ point: -1 });

    const count = await getQuery.clone().count();

    //bo sort krdna

    //id

    //ama bo awaya ka tanha datay aw row wana bgarenetawa ka yawtate bo nmwna name image price

    const page = req.query.page || 1;
    const limit = req.query.limit || 15;

    const skip = limit * (page - 1);

    getQuery.skip(skip).limit(limit);
    const user = await getQuery;

    res.status(200).json({
      stastus: "success",
      NumberOfData: count,
      data: user,
    });
  } catch (err) {
    res.status(404).json({ stastus: "error", message: "user not found" });
  }
};
export const getUsers = async (req, res) => {
  try {
    let query = JSON.stringify(req.query);

    //ama bo awaya la req.query kaya bysrynawa boy find ka eshkat
    let excluteQuery = ["limit"];
    //bo nwsyny gte ...
    query = query.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    let queryObj = JSON.parse(query);
    excluteQuery.forEach((i) => {
      delete queryObj[i];
    });

    const getQuery = User.find(queryObj).sort({ donate: -1 });

    const count = await getQuery.clone().count();

    //bo sort krdna

    //id

    //ama bo awaya ka tanha datay aw row wana bgarenetawa ka yawtate bo nmwna name image price

    const page = req.query.page || 1;
    const limit = req.query.limit || 15;

    const skip = limit * (page - 1);

    getQuery.skip(skip).limit(limit);
    const user = await getQuery;

    res.status(200).json({
      stastus: "success",
      NumberOfData: count,
      data: user,
    });
  } catch (err) {
    res.status(404).json({ stastus: "error", message: "user not found" });
  }
};

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
