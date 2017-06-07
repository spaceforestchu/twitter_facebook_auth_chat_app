'use strict';

const express = require('express');
const app = express();
const port = 3000;
const chatApp = require('./app');
const passport = require('passport');

app.set('port', process.env.PORT || port);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(chatApp.session);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', chatApp.router);

chatApp.ioServer(app).listen(app.get('port'), () => {
  console.log("SERVER STARTED @: " + app.get('port'));
});
