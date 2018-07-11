var router = require("express").Router(); //bo dinh tuyen
var message = require("./../utils/message");
var userController = require("./../controller/user.controller");

module.exports = () => {
  router.get("/", getAllUser);
  router.post("/", createUser);
  router.post("/login", loginUser);
  router.put("/password", updatePassword);
  router.put("/info", updateInfo);
  return router;
};

var filterEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var filterPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.\-\_])(?=.{6,})/;

function getAllUser(req, res, next) {
  userController
    .getAllUser()
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function createUser(req, res, next) {
  var request = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name
  };
  if (!request.name) {
    res.status(400).send({ message: message.ERROR_MESSAGE.USER.EMPTY_NAME });
  } else if (!filterEmail.test(request.email)) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.USER.NOT_STANDARD.EMAIL });
  } else if (!filterPass.test(request.password)) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.USER.NOT_STANDARD.PASS });
  } else {
    userController
      .createUser(request)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next(err);
      });
  }
}

function loginUser(req, res, next) {
  var request = {
    email: req.body.email,
    password: req.body.password
  };
  if (!filterPass.test(request.password)) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.USER.NOT_STANDARD.PASS });
  } else if (!filterEmail.test(request.email)) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.USER.NOT_STANDARD.EMAIL });
  } else {
    userController
      .loginUser(request)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next(err);
      });
  }
}

function updatePassword(req, res, next) {
  var request = {
    email: req.body.email,
    oldPass: req.body.oldPass,
    newPass: req.body.newPass
  };
  if (!filterEmail.test(request.email)) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.USER.NOT_STANDARD.EMAIL });
  } else if (!request.oldPass || !request.newPass) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.USER.NOT_STANDARD.PASS });
  } else {
    userController
      .updateUser_PASS(request)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next(err);
      });
  }
}

function updateInfo(req, res, next) {
  var request = {
    email: req.body.email,
    password: req.body.password,
    newName: req.body.newName
  };
  if (!filterEmail.test(request.email)) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.USER.NOT_STANDARD.EMAIL });
  } else if (!filterPass.test(request.password)) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.USER.NOT_STANDARD.PASS });
  } else if (!request.newName) {
    res.status(400).send({ message: message.ERROR_MESSAGE.USER.EMPTY_NAME });
  } else {
    userController
      .updateUser_INFO(request)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next(err);
      });
  }
}
