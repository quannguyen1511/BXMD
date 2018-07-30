var router = require("express").Router();
var companyController = require("../controller/company.controller");
var auth = require("./../middlewares/jwt-parser");
var config = require("./../config");

module.exports = () => {
  router.get("/", auth.parser(config.ROLE.ALL), getAllCompany);
  router.get("/:id", auth.parser(config.ROLE.ALL), getCompany);
  // router.get("/:taxID", getCompany);
  router.post("/", auth.parser(config.ROLE.ALL), createCompany);
  router.put("/:id", auth.parser(config.ROLE.ALL), updateCompany);
  router.delete("/:id", auth.parser(config.ROLE.ALL), deleteCompany);
  return router;
};

function createCompany(req, res, next) {
  var request = {
    taxID: req.body.taxID,
    companyName: req.body.companyName,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    createdUser: req.user.name
  };
  companyController
    .createCompany(request)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function getAllCompany(req, res, next) {
  if (!req.query.status) {
    companyController
      .getAllCompany()
      .then(function(response) {
        res.send(response);
      })
      .catch(function(err) {
        next(err);
      });
  } else {
    companyController
      .getCompanyContract(req.query.status)
      .then(function(response) {
        res.send(response);
      })
      .catch(function(err) {
        next(err);
      });
  }
}

// function getCompany(req, res, next) {
//   var request = {
//     id: req.params.id
//   };
//   companyController
//     .getCompany(request)
//     .then(function(response) {

//       res.send(response);
//     })
//     .catch(function(err) {
//       next(err);
//     });
// }

function getCompany(req, res, next) {
  var request = {
    id: req.params.id
  };
  companyController
    .getCompany(request)
    .then(function(response1) {
      companyController
        .getParkingLot(request)
        .then(function(response2) {
          companyController
            .getTicketOffice(request)
            .then(reponse3 =>
              res.send({
                companyINFO: response1,
                parkingLot: response2,
                roomTicket: reponse3
              })
            )
            .catch(function(err) {
              next(err);
            });
        })
        .catch(function(err) {
          next(err);
        });
    })
    .catch(function(err) {
      next(err);
    });
}

function updateCompany(req, res, next) {
  var request = {
    id: req.params.id,
    taxID: req.body.taxID,
    companyName: req.body.companyName,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    status: req.body.status,
    lastUpdateUser: req.user.name
  };
  companyController
    .updateCompany(request)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function deleteCompany(req, res, next) {
  var request = {
    id: req.params.id,
    lastUpdateUser: req.body.lastUpdateUser
  };
  companyController
    .deleteCompany(request)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}
