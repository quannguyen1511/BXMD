var router = require("express").Router();
var message = require("./../utils/message");
var parkingLotController = require("./../controller/parkingLot.controller");

module.exports = () => {
  router.get("/", getAllParkingLot);
  router.get("/create/:location", createDocument);
  router.get("/:id", getOneParkingLot);
  router.put("/:id", startRent);
  router.patch("/:id", updateRent);
  router.delete("/:id", deleteRent);
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

function createDocument(req, res, next) {
  parkingLotController.createDocument(req.params.location);
  res.send("ok");
}

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
    carNumber: req.body.carNumber
  };
  if (!request.expirationDate) {
    res.status(400).send({
      message: message.ERROR_MESSAGE.parkingLot.EMPTY_EXPIRATION_DATE
    });
  } else {
    if (!request.renter) {
      res
        .status(400)
        .send({ message: message.ERROR_MESSAGE.parkingLot.EMPTY_RENTER });
    } else {
      if (!request.carNumber) {
        res
          .status(400)
          .send({ message: message.ERROR_MESSAGE.parkingLot.EMPTY_CAR_NUMBER });
      } else {
        if (request.expirationDate <= request.rentedDate) {
          res
            .status(400)
            .send({ message: message.ERROR_MESSAGE.parkingLot.NOT_STANDARD });
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
    carNumber: req.body.carNumber
  };
  parkingLotController
    .updateParkingLot(request)
    .then(response => res.send(response))
    .catch(err => next(err));
}

function deleteRent(req, res, next) {
  var request = {
    id: req.params.id,
    companyTaxID: null,
    status: 0,
    rentedDate: null,
    expirationDate: null,
    renter: null,
    carNumber: null
  };
  parkingLotController
    .updateParkingLot(request)
    .then(response => res.send(response))
    .catch(err => next(err));
}
