var express = require("express");
const passport = require("passport");
var app = express();
var cors = require("cors");
(bodyParser = require("body-parser")), (path = require("path"));
// require('./db');
require("./auth");

// tmp db connection
// const mongoose = require("mongoose");

// // var course = require("./model/course.js");
// // var user = require("./model/user.js");

// // is the environment variable, NODE_ENV, set to PRODUCTION?
// let dbconf;
// if (process.env.NODE_ENV === "PRODUCTION") {
//   // if we're in PRODUCTION mode, then read the configration from a file
//   // use blocking file io to do this...
//   const fs = require("fs");
//   const path = require("path");
//   const fn = path.join(__dirname, "config.json");
//   const data = fs.readFileSync(fn);

//   // our configuration file will be in json, so parse it and set the
//   // conenction string appropriately!
//   const conf = JSON.parse(data);
//   dbconf = conf.dbconf;
// } else {
//   // if we're not in PRODUCTION mode, then use
//   dbconf =
//     "mongodb+srv://admin:1234@cluster0.th8fran.mongodb.net/?retryWrites=true&w=majority";
// }
// mongoose
//   .connect(dbconf)
//   .then(() => console.log("MongoDB successfully connected"))
//   .then(() => {
//     app.listen(process.env.PORT || 2000, () => {
//       console.log("Server is Runing On port 2000");
//     });
//   })
//   .catch((err) => console.log(err));

//db
const { success, error } = require("consola");
const { connect } = require("mongoose");
const PORT = 2000;
const DB = process.env.DB_URI;
const runApp = async () => {
  try {
    await connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      dbName: "CAD_DATA",
    });

    success({
      mssg: `Successfully connected to the Database,\n ${DB}`,
      badge: true,
    });
    //Listening for the server on port
    app.listen(PORT, () =>
      success({
        mssg: `Listening on port, ${PORT}`,
        badge: true,
      })
    );
  } catch (err) {
    error({
      mssg: `Database connection failed\n ${err}`,
      badge: true,
    });
    runApp();
  }
};

runApp();

// enable sessions
const session = require("express-session");
const sessionOptions = {
  secret: "secret cookie thang (store this elsewhere!)",
  resave: true,
  saveUninitialized: true,
};
app.use(session(sessionOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

const index = require("./routes/index");
const shop = require("./routes/shop");
const dashboard = require("./routes/dashboard");
app.use(cors());
app.use(express.static("uploads"));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: false,
  })
);

app.use("/", index);
app.use("/shop", shop);
app.use("/dashboard", dashboard);
// app.listen(process.env.PORT || 2000, () => {
//   console.log("Server is Runing On port 2000");
// });
