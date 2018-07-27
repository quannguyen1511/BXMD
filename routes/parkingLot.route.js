var router = require("express").Router();
var message = require("./../utils/message");
var parkingLotController = require("./../controller/parkingLot.controller");
var config = require("./../config");
var auth = require("./../middlewares/jwt-parser");

module.exports = () => {
  router.get("/", auth.parser(config.ROLE.ALL), getAllParkingLot);
  // router.post("/create/:location",auth.parser(config.ROLE.ADMIN),createDocument);
  router.get("/:id", auth.parser(config.ROLE.ALL), getOneParkingLot);
  router.put("/:id", auth.parser(config.ROLE.ALL), startRent);
  router.patch("/:id", auth.parser(config.ROLE.ALL), updateRent);
  router.delete("/:id", auth.parser(config.ROLE.ALL), deleteRent);
  return router;
};

function getAllParkingLot(req, res, next) {
  if (!req.query.location) {
    parkingLotController
      .getAllParkingLot()
      .then(function(response) {
        res.send(response);
      })
      .catch(function(err) {
        next(err);
      });
  } else {
    parkingLotController
      .getAllParkingLotInLocation(req.query.location)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next(err);
      });
  }
}

// function createDocument(req, res, next) {
//   var request = { location: req.params.location, user: req.user };
//   parkingLotController.createDocument(request);
//   res.send("ok");
// }

function getOneParkingLot(req, res, next) {
  parkingLotController
    .getParkingLot(req.params.id)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function startRent(req, res, next) {
  var request = {
    id: req.params.id,
    companyTaxID: req.body.companyTaxID,
    status: 1,
    rentedDate: new Date(req.body.rentedDate),
    expirationDate: new Date(req.body.expirationDate),
    renter: req.body.renter,
    carNumber: req.body.carNumber,
    user: req.user
  };
  if (!request.expirationDate) {
    res.status(400).send({
      message: message.ERROR_MESSAGE.PARKING_LOT.EMPTY_EXPIRATION_DATE
    });
  } else {
    if (!request.renter && !request.companyTaxID) {
      res
        .status(400)
        .send({ message: message.ERROR_MESSAGE.PARKING_LOT.EMPTY_RENTER });
    } else {
      if (!request.carNumber) {
        res.status(400).send({
          message: message.ERROR_MESSAGE.PARKING_LOT.EMPTY_CAR_NUMBER
        });
      } else {
        if (request.expirationDate <= request.rentedDate) {
          res
            .status(400)
            .send({ message: message.ERROR_MESSAGE.PARKING_LOT.NOT_STANDARD });
        } else {
          parkingLotController
            .createParkingLot(request)
            .then(response => res.send(response))
            .catch(err => next(err));
        }
      }
    }
  }
}

function updateRent(req, res, next) {
  var request = {
    id: req.params.id,
    companyTaxID: req.body.companyTaxID,
    status: 1,
    rentedDate: req.body.rentedDate,
    expirationDate: req.body.expirationDate,
    renter: req.body.renter,
    carNumber: req.body.carNumber,
    userUpdate: req.user.name,
    user: req.user
  };
  parkingLotController
    .updateParkingLot(request)
    .then(response => res.send(response))
    .catch(err => next(err));
}

function deleteRent(req, res, next) {
  var request = {
    id: req.params.id,
    status: 0,
    user: req.user
  };
  parkingLotController
    .deleteParkingLot(request)
    .then(response => res.send(response))
    .catch(err => next(err));
}
