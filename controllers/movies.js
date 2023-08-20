const { Movie } = require('../models/movie');
const { ValidationError } = require('../errors/ValidationError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');
const { VALIDATION_ERROR, NOT_FOUND_MOVIES, FORBIDDEN_DELETE_MOVIES } = require('../utils/errorMessage');

async function getAllMovie(req, res, next) {
  try {
    const owner = req.user._id;
    const movies = await Movie.find({ owner });
    if (!movies || movies.length === 0) {
       res.send({ message: 'Фильмы не найдены' });
     }
    res.send(movies);
  } catch (err) {
    next(err);
  }
}

async function createMovie(req, res, next) {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;

    const ownerId = req.user._id;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: ownerId,
    });
    res.status(201).send(movie);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(VALIDATION_ERROR));
      return;
    }

    next(err);
  }
}

async function deleteMovie(req, res, next) {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId).populate('owner');

    if (!movie) {
      throw new NotFoundError(NOT_FOUND_MOVIES);
    }

    const ownerId = movie.owner.id;
    const userId = req.user._id;

    if (ownerId !== userId) {
      throw new ForbiddenError(FORBIDDEN_DELETE_MOVIES);
    }

    await Movie.findByIdAndRemove(movieId);

    res.send(movie);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createMovie, deleteMovie, getAllMovie,
};
