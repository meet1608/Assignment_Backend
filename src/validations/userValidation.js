const Joi = require("joi");

exports.createUserSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  email: Joi.string().email().required()
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

exports.setPasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

exports.resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.ref("password")
});
exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});
exports.updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).optional(),
  lastName: Joi.string().min(2).optional(),
  email: Joi.string().email().optional(),
  profileImage: Joi.string().uri().optional()
});

