import passport from "passport";
import User from "../models/usermodels.js";

export const signUpMiddleware = passport.authenticate("signup", {
  session: false,
});

export const protect = passport.authenticate("jwt", { session: false });

export const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.sub);

      if (!user || user.role !== roles) {
        return res.status(401).json("not authorized");
      }

      next();
    } catch (error) {
      res.status(400).json(error);
    }
  };
};
