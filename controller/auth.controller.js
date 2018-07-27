var User = require("./../models/user.model");
var message = require("./../utils/message");
var jwt = require("./../utils/jwt");
var crypto = require("./../utils/crypto");

module.exports = {
  validateUser: validateUser
};

function validateUser(request) {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email: request.email
      },
      function(err, userModel) {
        if (err) {
          reject(err);
        } else if (!userModel) {
          reject({
            message: message.ERROR_MESSAGE.USER.NOT_FOUND,
            statusCode: 400
          });
        } else {
          var password = crypto.hashWithSalt(request.password, userModel.salt);
          if (password !== userModel.password) {
            reject({
              message: message.ERROR_MESSAGE.USER.WRONG_PASS,
              statusCode: 400
            });
          } else {
            jwt.sign(convertUserModelToUserResponse(userModel), function(
              err,
              token
            ) {
              if (err) {
                reject(err);
              } else {
                resolve({
                  token: token
                });
              }
            });
          }
        }
      }
    );
  });
}

function convertUserModelToUserResponse(userModel) {
  var userObj = userModel.toObject();
  delete userObj.password;
  delete userObj.salt;
  return userObj;
}
