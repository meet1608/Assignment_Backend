const userQueries = require("../queries/queries.js");

exports.createArticles = async (req, res) => {
  try {
    const userId = req.body.userId;
    const autherProfileImage = req.body.autherProfileImage;
    const autherName = req.body.autherName;
    const type = req.body.type || "draft";
    const { title, content } = req.body;
    const articleImage = req.files?.articleImage?.[0]
      ? `/uploads/${req.files.articleImage[0].filename}`
      : undefined;

    const articleData = { title, content, articleImage, type, user: userId, autherProfileImage: autherProfileImage, autherName: autherName };
    const article = await userQueries.createArticle(articleData);

    res.status(201).json({
      message: "Article created successfully",
      article: {
        id: article._id,
        title: article.title,
        content: article.content,
        articleImage: article.articleImage,
        autherProfileImage: article.autherProfileImage,
        autherName: article.autherName,
        user: article.user,
        type: article.type,
      },
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await userQueries.getAllArticles();
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
    const article = await userQueries.getArticleById(id);
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
    const article = await userQueries.deleteArticleById(id);
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
  try{
    const id = req.params.id;
    const { title, content, type } = req.body;
    const articleImage = req.files?.articleImage?.[0]
      ? `/uploads/${req.files.articleImage[0].filename}`
      : undefined;

    const articleData = { title, content, articleImage, type };
    const article = await userQueries.updateArticleById(id, articleData);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({
      message: "Article updated successfully",
      article: {
        id: article._id,
        title: article.title,
        content: article.content,
        articleImage: article.articleImage,
        user: article.user,
        autherProfileImage: article.autherProfileImage,
        autherName: article.autherName,
        type: article.type,
      },
    });
  }
  catch(error)
  {
    console.error("Error updating article by ID:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
