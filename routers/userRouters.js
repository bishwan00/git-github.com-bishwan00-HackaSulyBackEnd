import { Router } from "express";
import {
  getCurrentUser,
  getUsers,
  getUsersWinner,
  login,
  loginAdmin,
  signup,
} from "../controllers/userControllers.js";
import {
  checkRole,
  protect,
  signUpMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  uploadSingle,
  resizeImageUser,
} from "../middlewares/multerMiddleware.js";

const router = Router();

router.route("/").get(protect, getUsers);
router.route("/getwinner").get(protect, getUsersWinner);

router.route("/signup").post(signUpMiddleware, signup);
router.route("/currentuser").get(protect, getCurrentUser);
router.post("/login", login);

router.route("/login-admin").post(loginAdmin);
router
  .route("/upload")
  .post(
    protect,
    checkRole("user"),
    uploadSingle,
    resizeImageUser,
    (req, res) => {
      res.json({ path: `users/${req.file.filename}` });
    }
  );

export default router;
