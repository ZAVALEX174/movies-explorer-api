const router = require('express').Router();
const { userValidatePath } = require('../utils/validate');

const {
  updateUser,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', userValidatePath, updateUser);

module.exports = router;
