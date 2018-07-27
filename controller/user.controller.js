var User = require("./../models/user.model");
var message = require("./../utils/message");
var crypto = require("./../utils/crypto");

module.exports = {
  getAllUser: getAllUser,
  createUser: createUser,
  updateUser_PASS: updateUser_PASS,
  loginUser: loginUser,
  updateUser_INFO: updateUser_INFO
};

function getAllUser() {
  return new Promise((resolve, reject) => {
    User.find({}).exec(function(err, users) {
      if (err) {
        reject(err);
      } else {
        resolve(users);
      }
    });
  });
}

function createUser(request) {
  return new Promise((resolve, reject) => {
    User.findOne({
      email: request.email
    }).exec((err, userModel) => {
      if (err) {
        reject(err);
      } else {
        if (!userModel) {
          var salt = crypto.genSalt();
          var newUser = new User({
            email: request.email,
            name: request.name,
            salt: salt,
            password: crypto.hashWithSalt(request.password, salt)
          });

          newUser.save(function(err, response) {
            if (err) {
              reject(err);
            } else {
              resolve({ message: message.SUCCESS_MESSAGE.USER.CREATED });
            }
          });
        } else {
          reject({
            statusCode: 400,
            message: message.ERROR_MESSAGE.USER.EXIST
          });
        }
      }
    });
  });
}

function loginUser(request) {
  return new Promise((resolve, reject) => {
    User.findOne({
      email: request.email
    }).exec((err, userModel) => {
      if (err) {
        reject(err);
      } else {
        if (!userModel) {
          reject({
            statusCode: 400,
            message: message.ERROR_MESSAGE.USER.NOT_FOUND
          });
        } else {
          var pass = crypto.hashWithSalt(request.password, userModel.salt);
          if (pass !== userModel.password) {
            reject({
              statusCode: 400,
              message: message.ERROR_MESSAGE.USER.WRONG_PASS
            });
          } else {
            resolve({
              userModel: userModel,
              message: message.SUCCESS_MESSAGE.USER.LOGIN
            });
          }
        }
      }
    });
  });
}

function updateUser_PASS(request) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: request.email }).exec((err, userModel) => {
      if (err) {
        reject(err);
      }
      if (!userModel) {
        reject({
          statusCode: 404,
          message: message.ERROR_MESSAGE.USER.NOT_FOUND
        });
      } else {
        var oldPass = crypto.hashWithSalt(request.oldPass, userModel.salt);
        if (oldPass !== userModel.password) {
          reject({
            statusCode: 400,
            message: message.ERROR_MESSAGE.USER.WRONG_PASS
          });
        } else {
          var newSalt = crypto.genSalt();
          var newPassword = crypto.hashWithSalt(request.newPass, newSalt);
          userModel.salt = newSalt;
          userModel.password = newPassword;
          userModel.save(function(err, response) {
            if (err) {
              reject(err);
            } else {
              resolve({ message: message.SUCCESS_MESSAGE.USER.CHANGE.PASS });
            }
          });
        }
      }
    });
  });
}

function updateUser_INFO(request) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: request.email }).exec((err, userModel) => {
      if (err) {
        reject(err);
      }
      if (!userModel) {
        reject({
          statusCode: 400,
          message: message.ERROR_MESSAGE.USER.NOT_FOUND
        });
      } else {
        var password = crypto.hashWithSalt(request.password, userModel.salt);
        if (password !== userModel.password) {
          reject({
            statusCode: 400,
            message: message.ERROR_MESSAGE.USER.WRONG_PASS
          });
        } else {
          userModel.name = request.newName;
          userModel.save(function(err, response) {
            if (err) {
              reject(err);
            } else {
              resolve({ message: message.SUCCESS_MESSAGE.USER.CHANGE.INFO });
            }
          });
        }
      }
    });
  });
}
