require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { SALT_LENGTH } = require('../utils/secret');

const { User } = require('../models/user');
const { ConflictError } = require('../errors/ConflictError');
const { ValidationError } = require('../errors/ValidationError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { NotFoundError } = require('../errors/NotFoundError');
const {
  USER_NOT_UNIQUE, NOT_FOUND_USER, UN_AUTH_ERROR, VALIDATION_ERROR,
} = require('../utils/errorMessage');

async function updateUser(req, res, next) {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER);
    }

    res.send(user);
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError(USER_NOT_UNIQUE));
      return;
    }

    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const {
      email, password, name,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_LENGTH);

    let user = await User.create({
      email,
      password: passwordHash,
      name,
    });

    user = user.toObject();
    delete user.password;
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(VALIDATION_ERROR));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError(USER_NOT_UNIQUE));
      return;
    }

    next(err);
  }
}

async function login(req, res, next) {
  try {
    // вытащить email и password
    const { email, password } = req.body;
    // проверить существует ли пользователь с таким email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError(UN_AUTH_ERROR);
    } // проверить совпадает ли пароль
    const hasRightPassword = await bcrypt.compare(password, user.password);
    if (!hasRightPassword) {
      throw new UnauthorizedError(UN_AUTH_ERROR);
      // res.status(VALIDATION_ERROR).json({ message: 'Неверные данные' });
    }
    const token = jwt.sign(
      { _id: user._id },
      // 'secret-key',
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
    res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true });
    res.send({ token });
    // .send({ message: 'Успешная авторизация.' });
    // если совпадает - вернуть пользователя
    // если нет - вернуть ошибку
  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER);
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

async function logOut(_, res, next) {
  try {
    res.clearCookie('jwt').send({ message: 'Вышел из системы' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  updateUser, createUser, getCurrentUser, login, logOut,
};
