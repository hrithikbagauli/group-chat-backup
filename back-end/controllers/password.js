// const dotenv = require('dotenv');
// dotenv.config();
// const sgMail = require('@sendgrid/mail');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const ForgotPasswordRequests = require('../models/forgotPasswordRequests');
const path = require('path');
const bcrypt = require('bcrypt');
let req_uuid;

exports.forgotPassword = (req, res, next) => {
    const uuid = uuidv4();
    const email = req.body.email;
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user) {
            user.createForgotPasswordRequest({
                uuid: uuid,
                isActive: true
            }).then(() => {
                res.status(201).json(`http://localhost:4000/password/forgot-password/${uuid}`);
            });
        }
        else{
            res.status(404).json({ success: false, message: "This user doesn't exist!" });
        }
    })
    .catch(err=>{
        console.log(err);
    })
    // const email = req.body.email;
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // const message = {
    //     to: email,
    //     from: 'hrithikbagauli@gmail.com',
    //     subject: "Regenerate password",
    //     text: "Hello user, here's the link to regenerate your password",
    // };

    // sgMail.send(message)
    //     .then(() => {
    //         console.log('Email sent successfully');
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //     });
}

exports.resetPassword = (req, res, next) => {
    const uuid = req.params.uuid;

    ForgotPasswordRequests.findOne({
        where: { uuid: uuid }
    })
        .then(uuid => {
            req_uuid = uuid;
            if (uuid) {
                if (uuid.isActive) {
                    uuid.update({ isActive: false })
                        .then(() => {
                            res.sendFile(path.join(__dirname, '../public/html/update_password.html'));
                        })
                        .catch(err => console.log(err));
                }
                else {
                    res.status(400).json({ success: false, message: 'Link expired!' });
                }
            }
            else {
                res.status(401).json({ success: false, message: 'Invalid request!' });
            }
        })
        .catch(err => {
            console.log(err);
        })
}

exports.updatePassword = (req, res, next) => {
    User.findOne({
        where: { id: req_uuid.userId }
    })
    .then(user=>{
        bcrypt.hash(req.body.new_password, 10, (err, hash)=>{
            user.update({password: hash})
            .then(()=>{
                res.status(200).json({ success: true, message: 'Password updated successfully!' })
            })
            .catch(err=>{
                console.log(err);
            })
        });
    })
    .catch(err=>{
        res.status(400).json({ success: false, message: 'Something went wrong' });
    })
}