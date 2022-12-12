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
//   .catch((err) => console.log(err));
