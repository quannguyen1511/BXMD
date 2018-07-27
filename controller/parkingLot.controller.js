var parkingLot = require("./../models/parkingLot.model");
var message = require("./../utils/message");

module.exports = {
  createDocument: createDocument,
  getAllParkingLot: getAllParkingLot,
  getAllParkingLotInLocation: getAllParkingLotInLocation,
  getParkingLot: getParkingLot,
  createParkingLot: createParkingLot,
  updateParkingLot: updateParkingLot
};

function createDocument(request) {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var statusParkingLot = Math.floor(Math.random() * Math.floor(3));
      var newParkingLot = new parkingLot({
        col: j,
        row: i,
        status: statusParkingLot === 1 ? 0 : statusParkingLot,
        rentedDate: null,
        expirationDate: null,
        renter: null,
        carNumber: null,
        companyTaxID: null,
        location: request
      });
      newParkingLot.save();
    }
  }
}

function getAllParkingLot() {
  return new Promise((resolve, reject) => {
    parkingLot.find({}).exec(function(err, parkingLots) {
      if (err) {
        reject(err);
      } else {
        resolve(parkingLots);
      }
    });
  });
}

function getAllParkingLotInLocation(request) {
  return new Promise((resolve, reject) => {
    parkingLot.find({ location: request }).exec((err, parkingLots) => {
      if (err) {
        reject(err);
      } else {
        resolve(parkingLots);
      }
    });
  });
}

function getParkingLot(request) {
  return new Promise((resolve, reject) => {
    parkingLot
      .findOne({
        _id: request
      })
      .exec(function(err, parkingLotModel) {
        if (err) {
          reject(err);
        } else {
          if (!parkingLotModel) {
            reject({
              statusCode: 404,
              message: message.ERROR_MESSAGE.PARKING_LOT.NOT_FOUND
            });
          } else {
            resolve(parkingLotModel);
          }
        }
      });
  });
}

function createParkingLot(request) {
  return new Promise((resolve, reject) => {
    parkingLot
      .findOne({
        _id: request.id
      })
      .exec((err, parkingLotModel) => {
        if (err) {
          reject(err);
        } else {
          if (!parkingLotModel) {
            reject({
              statusCode: 404,
              message: message.ERROR_MESSAGE.PARKING_LOT.NOT_FOUND
            });
          } else {
            if (parkingLotModel.status === 1) {
              reject({
                statusCode: 409,
                message: message.ERROR_MESSAGE.PARKING_LOT.EXIST
              });
            } else {
              if (parkingLotModel.status === 2) {
                reject({
                  statusCode: 400,
                  message: message.ERROR_MESSAGE.PARKING_LOT.CANT_USE
                });
              } else {
                parkingLotModel.companyTaxID = request.companyTaxID;
                parkingLotModel.status = request.status;
                parkingLotModel.rentedDate = request.rentedDate;
                parkingLotModel.expirationDate = request.expirationDate;
                parkingLotModel.renter = request.renter;
                parkingLotModel.carNumber = request.carNumber;
                parkingLotModel.save((err, response) => {
                  if (err) reject(err);
                  else {
                    resolve(response);
                  }
                });
              }
            }
          }
        }
      });
  });
}

function updateParkingLot(request) {
  return new Promise((resolve, reject) => {
    parkingLot
      .findOne({
        _id: request.id
      })
      .exec((err, parkingLotModel) => {
        if (err) {
          reject(err);
        } else {
          if (!parkingLotModel) {
            reject({
              statusCode: 404,
              message: message.ERROR_MESSAGE.PARKING_LOT.NOT_FOUND
            });
          } else {
            if (parkingLotModel.status === 0) {
              reject({
                statusCode: 404,
                message: message.ERROR_MESSAGE.PARKING_LOT.EMPTY
              });
            } else {
              if (parkingLotModel.status === 2) {
                reject({
                  statusCode: 400,
                  message: message.ERROR_MESSAGE.PARKING_LOT.CANT_USE
                });
              } else {
                parkingLotModel.companyTaxID = request.companyTaxID
                  ? request.companyTaxID
                  : parkingLotModel.companyTaxID;
                parkingLotModel.status = request.status;
                parkingLotModel.rentedDate = request.rentedDate
                  ? new Date(request.rentedDate)
                  : parkingLotModel.rentedDate;
                parkingLotModel.expirationDate = request.expirationDate
                  ? new Date(request.expirationDate)
                  : parkingLotModel.expirationDate;
                parkingLotModel.renter = request.renter
                  ? request.renter
                  : parkingLotModel.renter;
                parkingLotModel.carNumber = request.carNumber
                  ? request.carNumber
                  : parkingLotModel.carNumber;
                parkingLotModel.save((err, response) => {
                  if (err) reject(err);
                  else {
                    resolve(response);
                  }
                });
              }
            }
          }
        }
      });
  });
}
