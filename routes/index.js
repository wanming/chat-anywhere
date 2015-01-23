
module.exports = function (app, io) {

  /* GET home page. */
  app.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
  });

  /* chat */

  io.on('connection', function (socket) {

    var room = '';
    var userName = '';

    console.log(socket.id, 'connected');

    socket.on('init', function (msg) {

      room = msg.room;
      userName = msg.userName;
      socket.join(msg.room); 
    });

    socket.on('chat-message', function (msg) {

      console.log('room', room, 'got message', msg.msg);

      io.to(room).emit('chat-message', { user: { name: userName }, msg: { date: +new Date(), content: msg.msg } });

    });

    socket.on('disconnect', function () {

      console.log(socket.id, 'left');
    });

  });

  function connect (msg) {

  }

  function getMessage (socket) {

  }

  function disconnect (socket) {

  }

  app.get('/chat', function (req, res) {
    res.render('chat', { title: 'Chat' });
  });

  /* chat end */

};