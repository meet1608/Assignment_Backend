const express = require("express");
const multer = require("multer");
const path = require("path");

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
} = require("../validations/articleValidation.js");
const authenticateToken = require("../middleware/authMiddleware.js");
const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // absolute path for safety
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName); // ensures unique filenames
  },
});
const upload = multer({ storage });

router.post(
  "/create",
  authenticateToken,
  upload.fields([{ name: "articleImage", maxCount: 1 }]),
  validate(createArticleSchema),
  createArticles
);

router.get("/all",authenticateToken ,getAllArticles);


router.delete("/delete/:id", authenticateToken,deleteArticleById);

router.put("/update/:id",
  authenticateToken,
  upload.fields([{ name: "articleImage", maxCount: 1 }]),
  validate(createArticleSchema),
  updateArticleById
);

router.get("/:id",authenticateToken,getArticleById);


module.exports = router;
