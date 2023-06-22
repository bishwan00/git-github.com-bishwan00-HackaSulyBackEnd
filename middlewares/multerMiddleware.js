import multer from "multer";
import customError from "../utilts/customError.js";
import sharp from "sharp";

const multerStorage = multer.memoryStorage();

export const resizeImage = async (req, res, next) => {
  if (!req.file) {
    next();
  }

  req.file.filename = `product-${Date.now()}-${Math.random(
    Math.random * 10000
  )}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/products/${req.file.filename}`);
  next();
};

export const resizeImageUser = async (req, res, next) => {
  if (!req.file) {
    next();
  }

  req.file.filename = `user-${Date.now()}-${Math.random(
    Math.random * 10000
  )}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${req.file.filename}`);
  next();
};

export const resizeImages = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  req.body.files = [];
  for (let i = 0; i < req.files.length; i++) {
    req.body.files.push(
      `product-${Date.now()}-${Math.random(Math.random * 10000)}-${i}.jpeg`
    );

    await sharp(req.files[i].buffer)
      .resize(500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${req.body.files[i]}`);
  }

  next();
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new customError("not an image", 400));
  }
};

const upload = multer({ storage: multerStorage, fileFilter });

export const uploadSingle = upload.single("image");
//ama la katekaya ka majmw3ayak rasm upload kat esta lera limite bo da aney ka 5 rasma
export const uploadMulti = upload.array("images", 5);
