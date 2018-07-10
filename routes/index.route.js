var router = require("express").Router();
var message = require("./../utils/message");
var indexController = require("./../controller/index.controller");

module.exports = () => {
  router.get("/", getAllIndex);
  router.get("/:col/:row", getIndex);
  router.post("/startrent/:col/:row", startRent);
  router.put("/update/:col/:row", updateRent);
  router.delete("/delete/:col/:row", deleteRent);
  return router;
};

function getAllIndex(req, res, next) {
  indexController
    .getAllIndex()
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function getIndex(req, res, next) {
  var request = {
    col: req.params.col,
    row: req.params.row
  };

  indexController
    .getIndex(request)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function startRent(req, res, next) {
  var request = {
    col: req.params.col,
    row: req.params.row,
    companyName: req.body.companyName,
    status: 1,
    rentedDate: new Date(),
    expirationDate: new Date(req.body.expirationDate),
    renter: req.body.renter,
    carNumber: req.body.carNumber
  };
  if (!request.expirationDate) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.INDEX.EMPTY_EXPIRATION_DATE });
  } else {
    if (!request.renter) {
      res
        .status(400)
        .send({ message: message.ERROR_MESSAGE.INDEX.EMPTY_RENTER });
    } else {
      if (!request.carNumber) {
        res
          .status(400)
          .send({ message: message.ERROR_MESSAGE.INDEX.EMPTY_CAR_NUMBER });
      } else {
        if (request.expirationDate <= request.rentedDate) {
          res
            .status(400)
            .send({ message: message.ERROR_MESSAGE.INDEX.NOT_STANDARD });
        } else {
          indexController
            .createIndex(request)
            .then(response => res.send(response))
            .catch(err => next(err));
        }
      }
    }
  }
}

function updateRent(req, res, next) {
  var request = {
    col: req.params.col,
    row: req.params.row,
    companyName: req.body.companyName,
    status: 1,
    rentedDate: new Dtae(req.body.rentedDate),
    expirationDate: new Date(req.body.expirationDate),
    renter: req.body.renter,
    carNumber: req.body.carNumber
  };
  indexController
    .updateIndex(request)
    .then(response => res.send(response))
    .catch(err => next(err));
}

function deleteRent(req, res, next) {
  var request = {
    col: req.params.col,
    row: req.params.row,
    companyName: " ",
    status: 0,
    rentedDate: new Date(),
    expirationDate: new Date(),
    renter: " ",
    carNumber: " "
  };
  indexController
    .updateIndex(request)
    .then(response => res.send(response))
    .catch(err => next(err));
}
