const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
    }),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
    }),
  password: Joi.string().required(),
});

const recipeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().max(1000).required(),
  cuisine: Joi.string()
    .valid('Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean', 'American', 'French', 'Thai', 'Japanese', 'Other')
    .required(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required(),
  prepTime: Joi.number().positive().required(),
  cookTime: Joi.number().positive().required(),
  servings: Joi.number().positive().required(),
  ingredients: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        quantity: Joi.string().required(),
        unit: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
  instructions: Joi.array()
    .items(
      Joi.object({
        step: Joi.number().required(),
        description: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
  tags: Joi.array().items(Joi.string()),
});

module.exports = {
  registerSchema,
  loginSchema,
  recipeSchema,
};
