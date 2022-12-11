const express = require('express'),
	router = express.Router(),
    user = require("../model/user.js"),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');

    router.use("/", (req, res, next) => {
        try {
          if (req.path == "/login" || req.path == "/register" || req.path == "/") {
            next();
          } else {
            /* decode jwt token if authorized*/
            jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
              if (decoded && decoded.user) {
                req.user = decoded;
                next();
              } else {
                return res.status(401).json({
                  errorMessage: 'User unauthorized!',
                  status: false
                });
              }
            })
          }
        } catch (e) {
          res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
          });
        }
      })
      
  router.get("/", (req, res) => {
    res.status(200).json({
      status: true,
      title: 'Apis'
    });
  });
  
  /* login api */
  router.post("/login", (req, res) => {
    try {
      if (req.body && req.body.username && req.body.password) {
        user.find({ username: req.body.username }, (err, data) => {
          if (data.length > 0) {
            if (bcrypt.compareSync(data[0].password, req.body.password)) {
              checkUserAndGenerateToken(data[0], req, res);
            } else {
  
              res.status(400).json({
                errorMessage: 'Username or password is incorrect!',
                status: false
              });
            }
  
          } else {
            res.status(400).json({
              errorMessage: 'Username or password is incorrect!',
              status: false
            });
          }
        })
      } else {
        res.status(400).json({
          errorMessage: 'Add proper parameter first!',
          status: false
        });
      }
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  
  });
  
  /* register api */
  router.post("/register", (req, res) => {
    try {
      if (req.body && req.body.username && req.body.password) {
  
        user.find({ username: req.body.username }, (err, data) => {
  
          if (data.length == 0) {
  
            let User = new user({
              username: req.body.username,
              password: req.body.password
            });
            User.save((err, data) => {
              if (err) {
                res.status(400).json({
                  errorMessage: err,
                  status: false
                });
              } else {
                res.status(200).json({
                  status: true,
                  title: 'Registered Successfully.'
                });
              }
            });
  
          } else {
            res.status(400).json({
              errorMessage: `UserName ${req.body.username} Already Exist!`,
              status: false
            });
          }
  
        });
  
      } else {
        res.status(400).json({
          errorMessage: 'Add proper parameter first!',
          status: false
        });
      }
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  });
  
  function checkUserAndGenerateToken(data, req, res) {
    jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
      if (err) {
        res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        res.json({
          message: 'Login Successfully.',
          token: token,
          status: true
        });
      }
    });
  }
  module.exports = router;
