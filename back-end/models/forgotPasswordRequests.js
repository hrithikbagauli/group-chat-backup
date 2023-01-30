const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const forgotPasswordRequests = sequelize.define('forgotPasswordRequests', {
    uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    isActive: Sequelize.BOOLEAN,
    expiresBy: Sequelize.DATE
})

module.exports = forgotPasswordRequests;