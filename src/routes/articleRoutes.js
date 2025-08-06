const express = require("express");
const multer = require("multer");
const {
  createArticles,
  getAllArticles,
  getArticleById,
  deleteArticleById,
  updateArticleById
} = require("../controllers/articleController.js");
const validate = require("../middleware/validate.js");
const {
  createArticleSchema,
} = require("../../validations/articleValidation.js");

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

router.post(
  "/create",
  upload.fields([{ name: "articleImage", maxCount: 1 }]),
  validate(createArticleSchema),
  createArticles
);

router.get("/all", getAllArticles);

router.get("/:id",getArticleById);

router.delete("/delete/:id", deleteArticleById);

router.put("/update/:id",
  upload.fields([{ name: "articleImage", maxCount: 1 }]),
  validate(createArticleSchema),
  updateArticleById
);


module.exports = router;
