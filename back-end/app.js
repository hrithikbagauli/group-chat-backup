const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const passwordRoutes = require('./routes/password');
const forgotPasswordRequests = require('./models/forgotPasswordRequests');
const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const UserGroup = require('./models/userGroup');
// const helmet = require('helmet');
// const morgan = require('morgan');
const fs = require('fs');

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, 'access.log'),
//   {flags: 'a'} //flags: 'a' means that new data will be appended to the existing data and not replace the existing data.
// )

const app = express();
const dotenv = require('dotenv');
dotenv.config();

// app.use(helmet());
// app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: 'null',
  methods: ["GET", "POST"]
}));
app.use(userRoutes);
app.use(messageRoutes);
app.use('/password', passwordRoutes);
app.use((req, res) => {
  res.sendFile(path.join(__dirname, `public/html/${req.url}`))
})

User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(forgotPasswordRequests);
forgotPasswordRequests.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group, { constraints: true, onDelete: 'CASCADE' });

Group.belongsToMany(User, { through: UserGroup });
User.belongsToMany(Group, { through: UserGroup });

sequelize
  .sync()
  // .sync({force: true})
  .then(() => {
    app.listen(parseInt(process.env.PORT_NO));
  }
  )
  .catch(err => {
    console.log(err);
  });

