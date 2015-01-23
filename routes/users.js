
module.exports = function (app, io) {

  app.get('/login', function (req, res) {

    res.render('account/login', { title: 'Login' });
  });


}