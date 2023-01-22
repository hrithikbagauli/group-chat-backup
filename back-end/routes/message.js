const express = require('express');
const messageController = require('../controllers/message');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/get-messages', auth.authenticate, messageController.getMessages);
router.post('/send-message', auth.authenticate , messageController.postSendMessage);
module.exports = router;