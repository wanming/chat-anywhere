
module.exports = function (app, io) {

  app.get('/login', function (req, res) {

    res.ejs('account/login', { title: 'Login' });
  });


}