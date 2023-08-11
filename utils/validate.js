const { celebrate, Joi } = require('celebrate');
const { validateObjectId } = require('./validateObjectId');
const { urlRegex } = require('./urlRegex');

const validateLink = /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i;

const validateSingnUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const validateSingnIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const paramsValidationConfig = {
  params: Joi.object().keys({
    movieId: Joi.string().custom(validateObjectId).required(),
  }),
};

const validateMoviePost = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(urlRegex),
    trailerLink: Joi.string().required().regex(urlRegex),
    thumbnail: Joi.string().required().regex(urlRegex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const userValidatePath = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports = {
  validateLink,
  validateSingnUp,
  validateSingnIn,
  paramsValidationConfig,
  validateMoviePost,
  userValidatePath,
};
