var db = require('../lib').db;
var config = require('../config');

module.exports = function (app, io) {

  /* GET home page. */
  app.get('/', function (req, res) {

    db.ChatHistory.findAll().then(function (retList) {
      console.log(retList);
    });

    res.ejs('index', { title: config.site.name });
  });

  /* chat */

  io.on('connection', function (socket) {

    var room = '';
    var userName = '';
    var userGuid = '';
    var ip = socket.handshake.address;

    console.log(socket.id, 'connected');

    socket.on('init', function (msg) {

      room = decodeURIComponent(decodeURIComponent(msg.room));
      userName = msg.userName;
      userGuid = msg.userGuid;
      socket.join(room); 
    });

    socket.on('chat-message', function (msg) {

      console.log('room', room, 'got message', msg.msg);

      storeChatHistory({
        userName: userName,
        content: msg.msg,
        ip: ip,
        userGuid: userGuid,
        roomName: room
      })
      .then(function (retCh) {
        io.to(room).emit('chat-message', retCh);
      });

    });

    socket.on('disconnect', function () {

      console.log(socket.id, 'left');
    });

  });

  app.all('/chat/*', function (req, res) {

    var roomName = req.url.slice(5);
    
    res.ejs('chat', { title: roomName + ' - chat-anywhere' });
  });

  app.post('/api/room_info', function (req, res) {

    var roomName = req.param('room');
    var room = io.sockets.adapter.rooms[roomName];
    var userCount = room ? Object.keys(room).length : 0;

    res.json({
      userCount: userCount
    });
  });

  app.post('/api/chat_history', function (req, res) {

    var roomName = req.param('room_name');
    var pageSize = req.param('page_size');
    var endId = req.param('end_id');

    getRecentHistory(roomName, pageSize, endId)
    .then(function (retList) {
      res.json(retList.reverse());
    });

  });

  function storeChatHistory (ch) {

    return db.ChatHistory.create(ch).then(function (ret) {
      console.log('new ChatHistory added.');
      return ret;
    });
  }

  // endId is not included in the result list.
  function getRecentHistory (roomName, pageSize, endId) {

    var where = {
      roomName: roomName
    };

    if (typeof endId !== 'undefined') {
      where.id = { lt: endId }
    }

    return db.ChatHistory.findAll({
      where: where,
      limit: pageSize,
      order: 'id desc'
    });
  }

  /* chat end */

};