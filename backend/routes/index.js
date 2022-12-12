const express = require("express"),
  router = express.Router(),
  user = require("../model/user.js"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken");

router.use("/", (req, res, next) => {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, "shhhhh11111", function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: "User unauthorized!",
            status: false,
          });
        }
      });
    }
  } catch (e) {
    return res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: "Apis",
  });
});

/* login api */
router.post("/login", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        console.log("[username]: " + req.body.username);
        if (data) {
          console.log("[DATA]: " + Object.values(data));
          if (bcrypt.compareSync(req.body.password, data[0].password)) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {
            console.log("[username/password taken] 1");
            return res.status(400).json({
              errorMessage: "Username or password is incorrect!",
              status: false,
            });
          }
        } else {
          console.log("[username/password taken] 2");
          return res.status(400).json({
            errorMessage: "Username or password is incorrect!",
            status: false,
          });
        }
      });
    } else {
      console.log("add proper parameters");
      return res.status(400).json({
        errorMessage: "Add proper parameter first!",
        status: false,
      });
    }
  } catch (e) {
    console.log("something went wrong. See error: " + Object.keys(e));
    return res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

/* register api */
router.post("/register", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.findOne({ username: req.body.username }, (err, data) => {
        console.log("[username]: " + req.body.username);
        if (!data) {
          let hashedPassword = bcrypt.hashSync(req.body.password, 12);
          let User = new user({
            username: req.body.username,
            password: hashedPassword,
          });
          console.log("[User]: " + Object.values(User));
          User.save((err, data) => {
            if (err) {
              console.log("[REGISTER_USER_ERROR] 1: " + Object.values(err)[3]);
              return res.status(400).json({
                errorMessage: err,
                status: false,
              });
            } else {
              return res.status(200).json({
                status: true,
                title: "Registered Successfully.",
              });
            }
          });
        } else {
          console.log("[REGISTER_USER_ERROR] 2: thrown here!");
          return res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false,
          });
        }
      });
    } else {
      console.log("[REGISTER_USER_ERROR] 3: thrown here!");
      return res.status(400).json({
        errorMessage: "Add proper parameter first!",
        status: false,
      });
    }
  } catch (e) {
    console.log("[REGISTER_USER_ERROR] 3: " + Object.keys(e));
    return res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign(
    { user: data.username, id: data._id },
    "shhhhh11111",
    { expiresIn: "1d" },
    (err, token) => {
      if (err) {
        console.log("[LOGIN_ERROR]: " + Object.keys(err));
        return res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        console.log("login successfully");
        return res.json({
          message: "Login Successfully.",
          token: token,
          status: true,
        });
      }
    }
  );
}
module.exports = router;
