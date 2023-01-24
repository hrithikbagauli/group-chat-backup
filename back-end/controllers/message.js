const dotenv = require('dotenv');
dotenv.config();
const Message = require('../models/message');
const User = require('../models/user');
const {Op} = require('sequelize');

exports.postSendMessage = async (req, res, next) => {
    try {
        await req.user.createMessage({ message: req.body.message });
        res.json({ success: true });
    } catch (err) {
        console.log(err)
    }
}

exports.getMessages = async (req, res, next) => {
    const last_message_id = 0;
    if(last_message_id){
        last_message_id = req.query.id;
    }
    // console.log('00000000000000000000000000000000000000000000000000000000',last_message_id);
    try {
        const messages = await Message.findAll({
            where: {
                id: {
                   [Op.gt]: last_message_id
                }
            },
            include: { model: User, attributes: ['name', 'createdAt'] }
        });
        res.json(messages);
    } catch (err) {
        console.log(err)
    }
}