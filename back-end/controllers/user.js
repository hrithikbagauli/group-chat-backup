const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const UserGroup = require('../models/userGroup');
const Group = require('../models/group');
const dotenv = require('dotenv');
dotenv.config();

exports.postUserSignup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      throw new Error(JSON.stringify(err));
    }
    try {
      await User.create({ name: req.body.name, email: req.body.email, password: hash, phone: req.body.phone, online: false })
      res.status(201).json({ success: true });
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false, message: err });
    }
  })
}

exports.postUserLogin = async (req, res, next) => {
  try {
    User.update({ online: true },
      { where: { email: req.body.email } });
    const user = await User.findAll({ where: { email: req.body.email } });

    if (user.length > 0) {
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          throw new Error(JSON.stringify(err));
        }
        if (result) {
          res.json({ success: true, message: 'Authenticated successfully!', username: user[0].name, token: generateToken(user[0].id, user[0].name) });
        }
        else {
          res.status(401).json({ success: false, message: 'Incorrect password!' });
        }
      })
    }
    else {
      res.status(404).json({ success: false, message: "This user doesn't exist!" });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
}

// exports.getOnlineUsers = async (req, res, next) => {
//   const users = await User.findAll({ where: { online: true }, attributes: ['name'] });
//   res.json(users);
// }

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ where: { id: { [Op.not]: req.user.id } }, attributes: ['name', 'id'] });
    res.json(users);
  }
  catch (err) {
    console.log(err);
  }
}

exports.createGroup = async (req, res, next) => {
  try {
    const group_details = await Group.create({ name: req.body.groupname });
    await UserGroup.create({ groupId: group_details.id, userId: req.user.id, isAdmin: true});
    req.body.participants.forEach(async (participant) => {
      await UserGroup.create({ groupId: group_details.id, userId: participant, isAdmin: false});
    })
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
}

exports.getGroups = async (req, res, next) => {
  let groups_arr = [];
  const groups = await UserGroup.findAll({
    where: {userId: req.user.id},
  })
  
  async function loop(){
    for(let i=0; i<groups.length; i++){
      const group = await Group.findByPk(groups[i].groupId);
      groups_arr.push({name: group.name, id: group.id});
    }
  }
  await loop();
  res.json(groups_arr);
}

function generateToken(id, user) {
  return jwt.sign({ userId: id, name: user }, process.env.TOKEN_SECRET_KEY);
}
