
var ticketOfficeController = require("./../controller/ticketOffice.controller");
var router = require("express").Router();
var auth = require("./../middlewares/jwt-parser");
var config = require("./../config");
var user = require("./../models/user.model");

module.exports = ()=> {
  router.get("/" ,auth.parser(config.ROLE.ALL), getAllTicketOffice);
  router.get("/block/:block", auth.parser(config.ROLE.ALL), getBlock);
  router.get("/:id", auth.parser(config.ROLE.ALL), getTicketOffice);
  router.post("/:id",auth.parser(config.ROLE.ALL), createTicketOffice);
  router.put("/:id",auth.parser(config.ROLE.ALL), updateTicketOffice);
  router.delete("/:id",auth.parser(config.ROLE.ALL), deleteTicketOffice);
  router.post("/",auth.parser(config.ROLE.ADMIN), createDatabase);
  return router;
}

function getAllTicketOffice(req, res, next) {
  ticketOfficeController
    .getAllTicketOffice()
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function getTicketOffice(req, res, next) {
  var request = {
    id: req.params.id
  };
  ticketOfficeController  
    .getTicketOffice(request)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function getBlock(req, res, next) {
  var request = {
    block: req.params.block
  };
  ticketOfficeController
    .getBlock(request)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function updateTicketOffice(req, res, next) {
  var request = {
    id : req.params.id,
    companyTaxID: req.body.companyTaxID,
    routes: req.body.routes,
    weeklyWorkingCalendar : req.body.weeklyWorkingCalendar,
    timeStartRent: req.body.timeStartRent,
    timeEndRent:req.body.timeEndRent,
    lastUpdateUser : req.user.name
  };
  ticketOfficeController
    .updateTicketOffice(request)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function deleteTicketOffice(req, res, next) {
  var request = {
    id : req.params.id
  };
  ticketOfficeController
    .deleteTicketOffice(request)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function createTicketOffice(req, res, next) {
  var request = {
    id : req.params.id,
    companyTaxID: req.body.companyTaxID,
    routes: req.body.routes,
    weeklyWorkingCalendar : req.body.weeklyWorkingCalendar,
    timeStartRent:req.body.timeStartRent,
    timeEndRent:req.body.timeEndRent,
    createdUser : req.user.name,
    lastUpdateUser : req.user.name
  };
  ticketOfficeController
    .createTicketOffice(request)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });

}

function createDatabase(req, res, next) {
  ticketOfficeController
    .createDatabase()
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}
