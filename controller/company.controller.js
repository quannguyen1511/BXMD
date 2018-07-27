var Company = require("../models/company.model");
var TicketOffice = require("../models/ticketOffice.model");
var ParkingLot = require("../models/parkingLot.model");
var message = require("./../utils/message");
var User = require("../models/user.model");

module.exports = {
  getAllCompany: getAllCompany,
  getCompany: getCompany,
  getParkingLot: getParkingLot,
  getTicketOffice: getTicketOffice,
  getCompanyContract: getCompanyContract,
  updateCompany: updateCompany,
  createCompany: createCompany,
  deleteCompany: deleteCompany
};

function getCompanyContract(request) {
  return new Promise((resolve, reject) => {
    Company.find({ status: request }).exec(function(err, companies) {
      if (err) {
        reject(err);
      } else {
        resolve(companies);
      }
    });
  });
}

function createCompany(request) {
  return new Promise((resolve, reject) => {
    Company.findOne({
      taxID: request.taxID,
      companyName: request.companyName
    }).exec((err, companyReq) => {
      if (err) {
        reject(err);
      } else {
        if (!companyReq) {
          var newCompanyJson = {
            createdTime: new Date(),
            createdUser: request.createdUser,
            status: 0
          };
          assignValueWhenCreateOrUpdate(newCompanyJson, request);
          var newCompany = new Company(newCompanyJson);
          newCompany.save((err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                message: message.SUCCESS_MESSAGE.COMPANY.PASS_CREATE
              });
            }
          });
        } else {
          reject({
            statusCode: 409,
            message: message.ERROR_MESSAGE.COMPANY.EXIST
          });
        }
      }
    });
  });
}

function getAllCompany() {
  return new Promise((resolve, reject) => {
    Company.find({}).exec(function(err, companies) {
      if (err) {
        reject(err);
      } else {
        resolve(companies);
      }
    });
  });
}

function getCompany(request) {
  return new Promise((resolve, reject) => {
    Company.findById(request.id).exec(function(err, company) {
      if (err) {
        reject(err);
      } else {
        if (!company) {
          reject({
            statusCode: 404,
            message: message.ERROR_MESSAGE.COMPANY.NOT_FOUND
          });
        } else {
          resolve(company);
        }
      }
    });
  });
}

function getParkingLot(request) {
  return new Promise((resolve, reject) => {
    ParkingLot.find({
      companyTaxID: request.id
    }).exec(function(err, parkingLots) {
      if (err) {
        reject(err);
      } else {
        if (!parkingLots) {
          reject({
            statusCode: 404,
            message: message.ERROR_MESSAGE.COMPANY.NOT_FOUND
          });
        } else {
          resolve(parkingLots);
        }
      }
    });
  });
}

function getTicketOffice(request) {
  return new Promise((resolve, reject) => {
    TicketOffice.find({
      companyTaxID: request.id
    }).exec(function(err, room) {
      if (err) {
        reject(err);
      } else {
        if (!room) {
          reject({
            statusCode: 404,
            message: message.ERROR_MESSAGE.COMPANY.NOT_FOUND
          });
        } else {
          resolve(room);
        }
      }
    });
  });
}

function updateCompany(request) {
  return new Promise((resolve, reject) => {
    Company.findById(request.id).exec((err, companyReq) => {
      if (err) {
        reject(err);
      } else {
        if (!companyReq) {
          reject({
            statusCode: 404,
            message: message.ERROR_MESSAGE.COMPANY.NOT_FOUND
          });
        } else {
          assignValueWhenCreateOrUpdate(companyReq, request);
          companyReq.lastUpdateUser = request.lastUpdateUser;
          companyReq.lastUpdateTime = new Date();
          companyReq.save((err, response) => {
            if (err) reject(err);
            else {
              resolve(response);
            }
          });
        }
      }
    });
  });
}

function deleteCompany(request) {
  return (promise = new Promise((resolve, reject) => {
    Company.findById(request.id).exec((err, companyReq) => {
      if (err) {
        reject(err);
      } else {
        if (companyReq) {
          if (companyReq.status === 1) {
            //Nếu đã xóa rồi thì không xóa nữa
            reject({
              statusCode: 400,
              message: message.ERROR_MESSAGE.COMPANY.FAIL_DELETE
            });
          } else {
            companyReq.lastUpdateUser = request.lastUpdateUser;
            companyReq.lastUpdateTime = new Date();
            companyReq.status = 1;
            companyReq.save((err, res) => {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }
        } else {
          reject({
            statusCode: 404,
            message: message.ERROR_MESSAGE.COMPANY.NOT_FOUND
          });
        }
      }
    });
  }));
}

function assignValueWhenCreateOrUpdate(companyReq, request) {
  console.log(request);
  companyReq.taxID = request.taxID;
  companyReq.address = request.address;
  companyReq.companyName = request.companyName;
  companyReq.phone = request.phone;
  companyReq.email = request.email;
  return companyReq;
}
