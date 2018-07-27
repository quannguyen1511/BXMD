var ticketOffice = require("../models/ticketOffice.model");
var message = require("./../utils/message");
var config = require("./../config");
var company = require("./../models/company.model");

module.exports = {
  getTicketOffice: getTicketOffice, // lấy thông tin một phòng
  getBlock : getBlock,//lấy thông tin một khu
  getAllTicketOffice: getAllTicketOffice,//lấy thông tin tất cả các phòng
  updateTicketOffice: updateTicketOffice, // update thông tin một phòng
  createTicketOffice: createTicketOffice, // tạo (cho thuê)một phòng mới
  deleteTicketOffice: deleteTicketOffice, // xóa một phòng đã cho thuê
  createDatabase: createDatabase // tạo các phòng cho collection
};
function createDatabase() {
  return promise = new Promise((resolve, reject) => {
    for (var i = 1; i <= config.dataBlock; i++) {
      for (var j = 1; j <= config.dateIndexOffice; j++){
        newTicketOffice = new ticketOffice({
          officeIndex: j,
          block: i,
          companyTaxID: null,
          status: 0,
          routes: [],
          weeklyWorkingCalendar: [{"day":7,"timeStart":null,"timeEnd":null},
          {"day":1,"timeStart":null,"timeEnd":null},
          {"day":2,"timeStart":null,"timeEnd":null},
          {"day":3,"timeStart":null,"timeEnd":null},
          {"day":4,"timeStart":null,"timeEnd":null},
          {"day":5,"timeStart":null,"timeEnd":null},
          {"day":6,"timeStart":null,"timeEnd":null}],
          timeStartRent: null,
          timeEndRent: null,
          createdUser: 'Quan',
          createdTime: new Date(),
          lastUpdateUser : 'Quan',  
          lastUpdateTime : new Date()
        });
      newTicketOffice.save((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            res,
            message: message.SUCCESS_MESSAGE.TICKET_OFFICE.PASS_CREATE
          });
        }
      });
    }
  }
  });
}
function getAllTicketOffice(){
  return promise = new Promise((resolve, reject) => {
      ticketOffice.find({}).exec(function(err, ticketOfficeReq) {
        if (err) {
          reject(err);
        } else {
          resolve(ticketOfficeReq);
        }
      });
    });
  }
function getBlock(request){
    return promise = new Promise((resolve, reject) => {
        ticketOffice.find({block: request.block})
        .exec(function(err, ticketOfficeReq) {
          if (err) {
            reject(err);
          } else {
              resolve(ticketOfficeReq);
          }
        });
      });
}
function getTicketOffice(request) {
  return promise = new Promise((resolve, reject) => {
      ticketOffice
        .findById( // 1 phòng
           request.id
        )
        .exec(function(err, ticketOfficeReq) {
          if (err) {
             reject(err);
          }
          if (!ticketOfficeReq) {
            reject({
              statusCode: 404,
              message: message.ERROR_MESSAGE.TICKET_OFFICE.NOT_FOUND
            });
          } else {
              resolve(ticketOfficeReq);
          }
        });
    });
}
function updateTicketOffice(request) {
  return (promise = new Promise((resolve, reject) => {
    ticketOffice
      .findById(
        request.id
      )
      .exec((err, ticketOfficeReq) => {
        if (err) {
          reject(err);
        } else {
          if (!ticketOfficeReq) {
            return reject({
              // nhập số phòng khu phòng sai
              statusCode: 404,
              message: message.ERROR_MESSAGE.TICKET_OFFICE.NOT_FOUND
            });
          }
          if (ticketOfficeReq.status === 0) {
            //phòng chưa thuê
            return reject({
              statusCode: 409,
              message: message.ERROR_MESSAGE.TICKET_OFFICE.NOT_RENTED
            });
          }
          if (testRequestNull(request)) {
            // dữ liệu null không update
            return reject({
                statusCode: 422,
                message: message.ERROR_MESSAGE.TICKET_OFFICE.REQUEST_NULL
              });
          }
          if (testRequest(request)) {
            // dữ liệu KHÔNG HỢP LỆ
            return reject({
                statusCode: 422,
                message: message.ERROR_MESSAGE.TICKET_OFFICE.REQUEST_FAIL
              });
          }
          if (testTimeRent(request.timeEndRent,ticketOfficeReq.timeStartRent) ||
            testTimeService(request)) {
            //thời gain bắt đầu lớn hơn kết thúc
            return reject({
              statusCode: 422,
              message: message.ERROR_MESSAGE.TICKET_OFFICE.DATE_TIME
            });
          }
            //update lên
          ticketOfficeReq.lastUpdateUser = request.lastUpdateUser;
          ticketOfficeReq.lastUpdateTime = new Date();
          testCompany(request, ticketOfficeReq).then((res)=>{
            resolve(res);
          }).catch((err)=>{
            reject(err);
          });
        }  
      });
  }));
}

function createTicketOffice(request) {
  return new Promise((resolve, reject) => {
    ticketOffice
      .findById(request.id)
      .exec((err, ticketOfficeReq) => {
        if (err) {
          reject(err);
        } else {
          if (!ticketOfficeReq) {

            return reject({
              // nhập số phòng sai
              statusCode: 404,
              message: message.ERROR_MESSAGE.TICKET_OFFICE.NOT_FOUND
            });
          }
          if (ticketOfficeReq.status === 1) {
            // nếu room đã được tạo rồi không tạo nữa
            return reject({
              statusCode: 409,
              message: message.ERROR_MESSAGE.TICKET_OFFICE.EXIST
            });
          }
          if (testRequestNull(request)) {
            // dữ liệu null không tạo
            return reject({
                statusCode: 422,
                message: message.ERROR_MESSAGE.TICKET_OFFICE.REQUEST_NULL
              });
          }
          if (testRequest(request)) {
            // dữ liệu KHÔNG HỢP LỆ
            return reject({
                statusCode: 422,
                message: message.ERROR_MESSAGE.TICKET_OFFICE.REQUEST_FAIL
              });
          }
          if (testTimeRent(request.timeEndRent, request.timeStartRent) ||
              testTimeService(request)) {
              // kiểm tra thời gian trả thuê và giờ bắt đầu kết thuc phục vụ
              return reject({
                statusCode: 422,
                message: message.ERROR_MESSAGE.TICKET_OFFICE.DATE_TIME
              });
          }
          ticketOfficeReq.createdUser= request.createdUser;
          ticketOfficeReq.createdTime= new Date();
          ticketOfficeReq.lastUpdateUser= request.lastUpdateUser;
          ticketOfficeReq.lastUpdateTime= new Date();
          testCompany(request, ticketOfficeReq).then((res)=>{ //kiem tra companyTaxID có hop le hay k
            resolve(res);
          }).catch((err)=>{
            reject(err);
          });
        }
      }); 
  });
}

function deleteTicketOffice(request) {
  return (promise = new Promise((resolve, reject) => {
    ticketOffice
      .findById(
        request.id
      )
      .exec((err, ticketOfficeReq) => {
        if (err) {
          reject(err);
        } else {
          if (ticketOfficeReq) {
            if (ticketOfficeReq.status == 0) {
              //Nếu đã xóa rồi thì không xóa nữa
              reject({
                statusCode: 409,
                message: message.ERROR_MESSAGE.TICKET_OFFICE.NOT_RENTED
              });
            } else {
              
              assignNull(ticketOfficeReq);
              ticketOfficeReq.save((err, res) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(res);
                }
              });
            }
          } else {
            reject({
              // nhập số phòng sai
              statusCode: 404,
              message: message.ERROR_MESSAGE.TICKET_OFFICE.NOT_FOUND
            });
          }
        }
      });
  }));
}

// các hàm kiểm tra
function testRequestNull(request) {
  // kiểm tra dữ liệu nhận có null hay không,

    var countRoutes = request.routes.length;
    console.log("countRoutes ",countRoutes);
    var countRoutesWorkingDay = 0;
    if(countRoutes === 0 || countRoutes > config.numberRoutes){
      return true;
    }//  ít nhất phải có một tuyến đường hoặc không được nhiều hơn numberRoutes tuyến đường
    for(var i = 0; i< countRoutes;i++){
      countRoutesWorkingDay = request.routes[i].workingDay.length;
      console.log("countRoutesWorkingDay",countRoutesWorkingDay);
        if(countRoutesWorkingDay === 0 || countRoutesWorkingDay > config.numberRoutesWorkingDay){
          return true;
     }//  ít nhất phải có một ngày làm việc hoặc không được nhiều hơn numberRoutesWorkingDay ngày làm việc
    }

    //nếu đúng thì kiểm tra null
    for(var j=0;j<countRoutes;j++){
      countRoutesWorkingDay = request.routes[j].workingDay.length;
      for(var k=0; k < countRoutesWorkingDay;k++){
        for(var i =0 ;i<config.numberDayWorkingOnWeek;i++){
        if (
          request.companyTaxID === null ||
          request.routes === null||
          request.routes[j].routeName === null ||
          request.routes[j].workingDay[k].day=== null||
          request.routes[j].workingDay[k].timeStart === null ||
          request.routes[j].workingDay[k].timeEnd === null ||
          request.weeklyWorkingCalendar[i].day === null ||
          request.weeklyWorkingCalendar[i].timeStart === null ||
          request.weeklyWorkingCalendar[i].timeEnd === null || 
          request.timeStartRent === null ||
          request.timeEndRent === null
        ) {
          return true;
        }
      }
    }
  }
}

function testRequest(request){
  var countRoutes = request.routes.length;
  for(var j=0;j<countRoutes;j++){
    var countRoutesWorkingDay = request.routes[j].workingDay.length;
    for(var k=0; k < countRoutesWorkingDay;k++){
      for(var i =0 ;i<config.numberDayWorkingOnWeek;i++){
      if (
        request.routes[j].workingDay[k].day > 7||request.routes[j].workingDay[k].day < 1||
        request.routes[j].workingDay[k].timeStart >24 ||request.routes[j].workingDay[k].timeStart <0 ||
        request.routes[j].workingDay[k].timeEnd >24 ||request.routes[j].workingDay[k].timeEnd <0 ||
        request.weeklyWorkingCalendar[i].day> 7 ||request.weeklyWorkingCalendar[i].day < 1||
        request.weeklyWorkingCalendar[i].timeStart >24 || request.weeklyWorkingCalendar[i].timeStart <0 ||
        request.weeklyWorkingCalendar[i].timeEnd >24 || request.weeklyWorkingCalendar[i].timeEnd <0
      ) {
        return true;
      }
    }
  }
}

}
function testTimeRent(end, start) {//kiểm tra thời gian trả > thời gian thuê
  return new Date(end).getTime() <= new Date(start).getTime();
}
function testTimeService(request) {// kiểm tra giờ kết thúc phục vụ có nhỏ hơn bắt đầu
  var countRoutes =  request.routes.length;
  for(var  i=0;i<countRoutes;i++){ //một trong 2 đúng thì return
    var countRoutesWorkingDay = request.routes[i].workingDay.length;
    for(var  j=0;j< countRoutesWorkingDay;j++){
      if(request.routes[i].workingDay[j].timeEnd < request.routes[i].workingDay[j].timeStart){
        return true;
        }
      }
    }
  for(var j=0;j<config.numberDayWorkingOnWeek;j++){
    if(request.weeklyWorkingCalendar[j].timeEnd < request.weeklyWorkingCalendar[j].timeStart){
      return true;
    }
    
  }
}
function assign(ticketOfficeReq, request) {// gán giá trị mới khi update hoặc tạo
  var countRoutes =  request.routes.length;
  ticketOfficeReq.status = 1;
  for(var i = 0; i< countRoutes;i++){
      ticketOfficeReq.routes.push(request.routes[i]);
  }
  for(var i=0; i<config.numberDayWorkingOnWeek ;i++){
      ticketOfficeReq.weeklyWorkingCalendar[i]=request.weeklyWorkingCalendar[i];
  }
  ticketOfficeReq.timeStartRent = request.timeStartRent;
  ticketOfficeReq.timeEndRent = request.timeEndRent;
  return ticketOfficeReq;
}
function assignNull(ticketOfficeReq){//gán null để xóa
  ticketOfficeReq.status = 0;
  ticketOfficeReq.companyTaxID = null;
  ticketOfficeReq.routes=[];
  ticketOfficeReq.weeklyWorkingCalendar=  [{"day":7,"timeStart":null,"timeEnd":null},
  {"day":1,"timeStart":null,"timeEnd":null},
  {"day":2,"timeStart":null,"timeEnd":null},
  {"day":3,"timeStart":null,"timeEnd":null},
  {"day":4,"timeStart":null,"timeEnd":null},
  {"day":5,"timeStart":null,"timeEnd":null},
  {"day":6,"timeStart":null,"timeEnd":null}];
  ticketOffice.timeStartRent = null;
  ticketOfficeReq.timeEndRent = null;
  ticketOfficeReq.createdUser= 'Quan';
  ticketOfficeReq.createdTime= new Date();
  ticketOfficeReq.lastUpdateUser = 'Quan';
  ticketOfficeReq.lastUpdateTime = new Date()
  return ticketOfficeReq;
}

function testCompany(request, ticketOfficeReq){ //kiểm tra nhập đúng mã số thuế của công ty
  return promise = new Promise((resolve, reject)=>{
    company.findOne({taxID : request.companyTaxID})
            .exec((err, companyReq) => {
              if (err) {
                reject(err);
              } else {
                if(!companyReq){// nếu không tồn tại công ty đó
                  return reject({
                    statusCode: 404,
                    message: message.ERROR_MESSAGE.TICKET_OFFICE.COMPANY_NOT_FOUND
                  });
                }
                //nhập đúng TaxID thì tạo
                ticketOfficeReq = assign(ticketOfficeReq, request);
                    ticketOfficeReq.companyTaxID = companyReq._id; // gán companyTaxID bằng company ID 
                    //nếu tìm được đúng company đó
                    ticketOfficeReq.save((err, res) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(res);
                      }
                    });
              }
            });
  });

}

