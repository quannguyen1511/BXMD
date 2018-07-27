var message = require("./../utils/message");
var jwt = require("./../utils/jwt");
var userController = require("./../controller/user.controller");
var config = require("./../config");

exports.parser = function() {
  var role = Array.prototype.slice.call(arguments);
  return function(req, res, next) {
    var token = req.headers["x-access-token"];
    if (token) {
      jwt.verify(token, function(err, decodedData) {
        if (err) {
          res.status(401);
          res.json({
            message: message.ERROR_MESSAGE.AUTH.INVALID_TOKEN
          });
        } else {
          var email = decodedData.email;
          //If is User, get from database
          if (
            decodedData.role === config.ROLE.USER &&
            role.indexOf(config.ROLE.USER) > -1
          ) {
            userController
              .getUserByEmail(email)
              .catch(err => {
                next(err);
              })
              .then(response => {
                req.user = response;
                next();
              });
          } else if (
            decodedData.role === config.ROLE.ADMIN &&
            role.indexOf(config.ROLE.ADMIN) > -1
          ) {
            req.user = decodedData;
            next();
          } else {
            if (role.indexOf(config.ROLE.ALL) > -1) {
              req.user = decodedData;
              next();
            } else {
              res.status(405);
              res.json({
                message: message.ERROR_MESSAGE.AUTH.PERMISSION
              });
            }
          }
        }
      });
    } else {
      res.status(401);
      res.json({
        message: message.ERROR_MESSAGE.AUTH.NOT_AUTHORIZED
      });
    }
  };
};
