require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const { limiter } = require('./middlewares/rateLimiter');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes');
const { handleError } = require('./middlewares/handleError');

const { PORT = 3000 } = process.env;

const { DATABASE_URL } = require('./utils/secret');

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3001',
    'https://localhost:3001',
    'http://localhost:3000',
    'https://localhost:3000',
    'https://api.zuevmesto.students.nomoredomains.xyz',
    'http://api.zuevmesto.students.nomoredomains.xyz',
    'https://zuevdiplom.nomoredomains.xyz',
    'http://zuevdiplom.nomoredomains.xyz'],
  credentials: true,
  maxAge: 3600,
}));

app.use(helmet());

mongoose.connect(DATABASE_URL);

app.use(cookieParser());

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(limiter);

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(handleError);

app.listen(PORT);
