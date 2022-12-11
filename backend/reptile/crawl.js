const request = require("request");

const crawlerGET = (Url, cb) => {
  request({
    url: "https://schedge.a1liu.com/"+Url,
    method: "GET",
    json: true,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Methods": 'POST,GET,OPTIONS',
    },
  }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            cb(body);
        }
        else{
            console.log("Crawaling Failed:"+"https://schedge.a1liu.com/"+Url);

        }
  });
};

module.exports ={
  crawlerGET:crawlerGET
};