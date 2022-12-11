var express = require("express");
const passport = require('passport');
var app = express();
var cors = require('cors');
  bodyParser = require('body-parser'),
  path = require('path');
require('./db');
require('./auth');


// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

const index = require('./routes/index');
const shop = require('./routes/shop');
const dashboard = require('./routes/dashboard');
app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

app.use('/', index);
app.use('/shop', shop);
app.use('/dashboard', dashboard);
app.listen(process.env.PORT || 2000, () => {
  console.log("Server is Runing On port 2000");
});