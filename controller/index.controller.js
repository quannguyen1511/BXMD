var Index = require("./../models/index.model");
var message = require("./../utils/message");

module.exports = {
  getAllIndex: getAllIndex,
  getIndex: getIndex,
  createIndex: createIndex,
  updateIndex: updateIndex
};

function getAllIndex() {
  return new Promise((resolve, reject) => {
    Index.find({}).exec(function(err, indexes) {
      if (err) {
        reject(err);
      } else {
        resolve(indexes);
      }
    });
  });
}

function getIndex(request) {
  return new Promise((resolve, reject) => {
    Index.findOne({
      col: request.col,
      row: request.row
    }).exec(function(err, indexModel) {
      if (err) {
        reject(err);
      } else {
        if (!indexModel) {
          reject({
            statusCode: 404,
            message: message.ERROR_MESSAGE.INDEX.NOT_FOUND
          });
        } else {
          resolve(indexModel);
        }
      }
    });
  });
}

function createIndex(request) {
  return new Promise((resolve, reject) => {
    Index.findOne({ col: request.col, row: request.row }).exec(
      (err, indexModel) => {
        if (err) {
          reject(err);
        } else {
          if (!indexModel) {
            reject({
              statusCode: 404,
              message: message.ERROR_MESSAGE.INDEX.NOT_FOUND
            });
          } else {
            if (indexModel.status === 1) {
              reject({
                statusCode: 400,
                message: message.ERROR_MESSAGE.INDEX.EXIST
              });
            } else {
              indexModel.companyName = request.companyName;
              indexModel.status = request.status;
              indexModel.rentedDate = request.rentedDate;
              indexModel.expirationDate = request.expirationDate;
              indexModel.renter = request.renter;
              indexModel.carNumber = request.carNumber;
              indexModel.save((err, response) => {
                if (err) reject(err);
                else {
                  resolve(response);
                }
              });
            }
          }
        }
      }
    );
  });
}

function updateIndex(request) {
  return new Promise((resolve, reject) => {
    Index.findOne({ col: request.col, row: request.row }).exec(
      (err, indexModel) => {
        if (err) {
          reject(err);
        } else {
          if (!indexModel) {
            reject({
              statusCode: 404,
              message: message.ERROR_MESSAGE.INDEX.NOT_FOUND
            });
          } else {
            if (indexModel.status === 0) {
              reject({
                statusCode: 404,
                message: message.ERROR_MESSAGE.INDEX.EMPTY
              });
            } else {
              indexModel.companyName = request.companyName;
              indexModel.status = request.status;
              indexModel.rentedDate = request.rentedDate;
              indexModel.expirationDate = request.expirationDate;
              indexModel.renter = request.renter;
              indexModel.carNumber = request.carNumber;
              indexModel.save((err, response) => {
                if (err) reject(err);
                else {
                  resolve(response);
                }
              });
            }
          }
        }
      }
    );
  });
}
