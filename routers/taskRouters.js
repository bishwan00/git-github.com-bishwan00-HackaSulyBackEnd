import { Router } from "express";

import {
  resizeImagesTask,
  uploadMulti,
} from "../middlewares/multerMiddleware.js";
import { checkRole, protect } from "../middlewares/authMiddleware.js";
import {
  addtask,
  deletetask,
  getTasks,
  updatetask,
} from "../controllers/taskController.js";

const router = Router();
router.route("/").get(getTasks).post(addtask);
router.route("/:id").patch(updatetask).delete(deletetask);

router
  .route("/uploads")
  .post(
    protect,
    checkRole("user"),
    uploadMulti,
    resizeImagesTask,
    (req, res) => {
      const paths = req.files.map((file) => {
        return `tasks/${file.originalname}`;
      });

      res.json({ paths });
    }
  );

export default router;
