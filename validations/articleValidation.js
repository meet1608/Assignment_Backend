const Joi = require("joi");

exports.createArticleSchema = Joi.object({
  
  title: Joi.string().min(3).required().messages({
    "any.required": "Title is required"
  }),
  content: Joi.string().min(10).required().messages({
    "any.required": "Content is required"
 
  }),
 
}).options({ abortEarly: false, allowUnknown: true });

