const dotenv = require('dotenv');
dotenv.config();
const Message = require('../models/message');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.postSendMessage = async (req, res, next) => {
    try {
        await req.user.createMessage({ message: req.body.message, groupId: req.body.gId });
        res.json({ success: true });
    } catch (err) {
        console.log(err)
    }
}

// exports.getMessages = async (req, res, next) => {
//     let last_message_id = 0;
//     if(req.query.id != 'undefined'){
//         last_message_id = parseInt(req.query.id);
//     }

//     console.log(last_message_id)
//     console.log(typeof(last_message_id))
//     try {
//         const messages = await Message.findAll({
//             where: {
//                 id: {
//                    [Op.gt]: last_message_id
//                 }
//             },
//             include: { model: User, attributes: ['name', 'createdAt'] }
//         });
//         res.json(messages);
//     } catch (err) {
//         console.log(err)
//     }
// }

exports.getMessages = async (req, res, next) => {
    try {
        const messages = await Message.findAll({
            where: {
                groupId: req.query.gId,
                id: {[Op.gt]: req.query.last_message_id}
            },
            include: { model: User, attributes: ['name', 'createdAt'] }
        });
        res.json(messages);
    } catch (err) {
        console.log(err)
    }
}