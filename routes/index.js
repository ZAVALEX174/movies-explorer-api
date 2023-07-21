const router = require('express').Router();
const { login, createUser, logOut } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { NotFoundError } = require('../errors/NotFoundError');
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { validateSingnUp, validateSingnIn } = require('../utils/validate');

router.post(
  '/signup',
  validateSingnUp,
  createUser,
);

router.post(
  '/signin',
  validateSingnIn,
  login,
);

router.post('/signout', logOut);

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = router;
