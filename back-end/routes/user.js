const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const auth = require('../middleware/auth')

router.post('/user-signup', userController.postUserSignup);
router.post('/user-login', userController.postUserLogin);
// router.get('/online-user', userController.getOnlineUsers);
router.get('/users', auth.authenticate, userController.getUsers);
router.post('/create-group', auth.authenticate, userController.createGroup);
router.get('/groups', auth.authenticate, userController.getGroups);

module.exports = router;
