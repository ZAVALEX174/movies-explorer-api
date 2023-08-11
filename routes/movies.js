const router = require('express').Router();
const { celebrate } = require('celebrate');

const { paramsValidationConfig, validateMoviePost } = require('../utils/validate');

const {
  getAllMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getAllMovie);

router.post('/', validateMoviePost, createMovie);

router.delete('/:movieId', celebrate(paramsValidationConfig), deleteMovie);

module.exports = router;
