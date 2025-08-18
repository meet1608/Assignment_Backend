const fs = require("fs");
const path = require("path");

const articleQueries = require("../services/articleServices.js");
exports.createArticles = async (req, res) => {
  try {
    const type = req.body.type || "draft";
    const { title, content } = req.body;
    const userId = req.user.id;

    const articleImage = req.files?.articleImage?.[0]
      ? `/uploads/${req.files.articleImage[0].filename}`
      : undefined;

    const articleData = { title, content, articleImage, type, user: userId };
    // const article = await userQueries.createArticle(articleData);
    const article = await articleQueries.createArticle(articleData);
    res.status(201).json({
      message: "Article created successfully",
      article,
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const search = req.query.search || "";
    const getAll = req.query.all === "true";
    const type = req.query.type;
    const userId = getAll ? null : req.user && req.user.id ? req.user.id : null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const articles = await articleQueries.getAllArticles(
      search,
      userId,
      type,
      page,
      limit
    );

    if (!articles || articles.total === 0) {
      return res.status(404).json({ message: "No articles found" });
    }

    res.status(200).json({
      message: "Articles fetched successfully",
      articles,
      pagination: {
        page,
        limit,
        total: articles.total,
        totalPages: Math.ceil(articles.total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const id = req.params.id;
    // const article = await userQueries.getArticleById(id);
    const article = await articleQueries.getArticleById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({
      message: "Article fetched successfully",
      article,
    });
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteArticleById = async (req, res) => {
  try {
    const id = req.params.id;
    // const article = await userQueries.deleteArticleById(id);
    const article = await articleQueries.deleteArticleById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article by ID:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateArticleById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Article ID is required" });
    }
    //first we will find that article id that is updated
    const findAndDelete = await articleQueries.getArticleById(id);
    if (!findAndDelete) {
      return res.status(404).json({ message: "Article not found" });
    }

    //we will check is new image is available or we need to keep old image
    const articleImage = req.files?.articleImage?.[0]
      ? `/uploads/${req.files.articleImage[0].filename}`
      : findAndDelete.articleImage;

    if (req.files?.articleImage?.[0] && findAndDelete.articleImage) {
      const oldImage = path.join(__dirname, "..", findAndDelete.articleImage);
      if (fs.existsSync(oldImage)) {
        fs.unlink(oldImage, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          }
        });
      }
    }
    const { title, content, type } = req.body;
    const articleData = { title, content, articleImage, type };

    const article = await articleQueries.updateArticleById(id, articleData);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({
      message: "Article updated successfully",
      article,
    });
  } catch (error) {
    console.error("Error updating article by ID:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
