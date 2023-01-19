const express = require('express');
const passwordController = require('../controllers/password');
const router = express.Router();

router.post('/forgot-password', passwordController.forgotPassword);
router.get('/forgot-password/:uuid', passwordController.resetPassword);
router.post('/update-password', passwordController.updatePassword);

module.exports = router;