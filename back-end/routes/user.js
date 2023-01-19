const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();

router.post('/user-signup', userController.postUserSignup);
router.post('/user-login', userController.postUserLogin);

module.exports = router;
