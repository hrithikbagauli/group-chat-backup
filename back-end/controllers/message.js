const dotenv = require('dotenv');
dotenv.config();
const Message = require('../models/message');
const User = require('../models/user');
exports.postSendMessage = async (req, res, next) => {
    try {
        await req.user.createMessage({ message: req.body.message });
        res.json({ success: true });
    } catch (err) {
        console.log(err)
    }
}

exports.getMessages = async (req, res, next) => {
    try {
        const messages = await Message.findAll({
            include: { model: User, attributes: ['name', 'createdAt'] }
        });
        res.json(messages);
    } catch (err) {
        console.log(err)
    }
}