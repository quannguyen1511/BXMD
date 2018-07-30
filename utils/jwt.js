var jwt = require("jsonwebtoken");
var fs = require("fs");

var cert = fs.readFileSync(__dirname + "/key/key.pem");
var pub = fs.readFileSync(__dirname + "/key/key.pub");

module.exports = {
  sign: sign,
  verify: verify
};

function sign(obj, callback) {
  jwt.sign(
    obj,
    cert,
    {
      algorithm: "RS256"
    },
    function(err, token) {
      callback(err, token);
    }
  );
}
function verify(token, callback) {
  jwt.verify(token, pub, function(err, decoded) {
    callback(err, decoded);
  });
}
