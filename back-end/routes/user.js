const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const auth = require('../middleware/auth')

router.post('/user-signup', userController.postUserSignup);
router.post('/user-login', userController.postUserLogin);
// router.get('/online-user', userController.getOnlineUsers);
router.get('/users', auth.authenticate, userController.getUsers);
router.post('/create-group', auth.authenticate, userController.createGroup);
router.post('/update-group', auth.authenticate, userController.updateGroup);
router.get('/groups', auth.authenticate, userController.getGroups);
router.get('/non-members', auth.authenticate, userController.getNonMembers);
router.get('/members', auth.authenticate, userController.getMembers);
router.post('/make-admin', auth.authenticate, userController.makeAdmin);
router.post('/remove-user', auth.authenticate, userController.removeUser);

module.exports = router;
