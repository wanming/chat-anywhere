var config = require('../config');
var Sequelize = require('sequelize');

var sequelize = new Sequelize(config.db.dbName, config.db.userName, config.db.password, {
  port: config.db.port,
  host: config.db.host
});
 
var ChatHistory = sequelize.define('ChatHistory', {
  roomName  : Sequelize.TEXT,
  userName  : Sequelize.TEXT,
  userGuid  : Sequelize.STRING(50),
  content   : Sequelize.TEXT,
  createdAt : Sequelize.DATE,
  updatedAt : Sequelize.DATE,
  ip        : Sequelize.STRING(50)
}, {
  tableName: 'chat_history'
});


exports = module.exports = {
  ChatHistory: ChatHistory
}