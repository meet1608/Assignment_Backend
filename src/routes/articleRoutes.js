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
const authorizeRole = require("../middleware/roleAuth.js");

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName); 
  },
});
const upload = multer({ storage ,limits:{fileSize: 5*1024*1024}});

router.post(
  "/create",
  authenticateToken,
  authorizeRole(["user", "admin"]),
  upload.fields([{ name: "articleImage", maxCount: 1 }]),
  validate(createArticleSchema),
  createArticles
);

router.get("/all",authenticateToken ,authorizeRole(["admin","user"]),getAllArticles);


router.delete("/delete/:id", authenticateToken,authorizeRole(["user", "admin"]),deleteArticleById);

router.put("/update/:id",
  authenticateToken,
  authorizeRole(["user", "admin"]),
  upload.fields([{ name: "articleImage", maxCount: 1 }]),
  validate(createArticleSchema),
  updateArticleById
);

router.get("/:id",authenticateToken,authorizeRole(["user", "admin"]),getArticleById);


module.exports = router;
