import { Router } from "express";

import {
  addPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/postControllers.js";
import {
  resizeImagesPost,
  uploadMulti,
} from "../middlewares/multerMiddleware.js";
import { checkRole, protect } from "../middlewares/authMiddleware.js";

const router = Router();
router.route("/").get(getPosts).post(addPost);
router.route("/:id").patch(updatePost).delete(deletePost);

router
  .route("/uploads")
  .post(protect, uploadMulti, resizeImagesPost, (req, res) => {
    const paths = req.body.files.map((file) => {
      return `posts/${file}`;
    });

    res.json({ paths });
  });

export default router;
