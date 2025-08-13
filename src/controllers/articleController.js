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
    // const articles = await userQueries.getAllArticles({});
   const search = req.query.search || "";
    // if query param all=true, ignore userId
    const getAll = req.query.all === 'true';

    const userId = getAll ? null : (req.user && req.user.id ? req.user.id : null);
    const articles = await articleQueries.getAllArticles(search,userId);
     

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: "No articles found" });
    }

    res.status(200).json({
      message: "Articles fetched successfully",
      articles,
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
    const { title, content, type } = req.body;
    const articleImage = req.files?.articleImage?.[0]
      ? `/uploads/${req.files.articleImage[0].filename}`
      : undefined;

    const articleData = { title, content, articleImage, type };
    // const article = await userQueries.updateArticleById(id, articleData);
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
