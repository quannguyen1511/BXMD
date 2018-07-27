var mongoose = require("mongoose");
var config = require("./../config");

var Schema = mongoose.Schema; //dinh nghia 1 kieu cau truc cho mongo

var ticketOfficeSchema = new Schema({
  officeIndex: {
    type: Number,
    required: true
  },

  block: {
    // số khu của phòng vé
    type: Number,
    required: true
  },
  status: {
    //Có cho thuê chưa
    type: Number,
    required: true,
    default: config.status //mặc định là chưa thuê
  },
  companyTaxID: {
    // mã số thuế
    type: String
  },
  routes: [
    {
      // mảng tuyến đường lưu các object tuyến đường
      routeName: String, //tên tuyến đường
      workingDay: [
        {
          // ngày làm việc,
          day: Number,
          timeStart: Number, //giờ bắt đầu bán
          timeEnd: Number //giờ nghỉ
        }
      ]
    }
  ],
  weeklyWorkingCalendar: [
    {
      day: Number,
      timeStart: Number,
      timeEnd: Number
      // ngày làm việc trong tuần
    }
  ],
  timeStartRent: {
    // thời gian bắt đầu cho thuê phòng vé
    type: Date
  },
  timeEndRent: {
    // thời gian công ty trả phòng vé
    type: Date
  },
  createdUser: {
    type: String
  },
  createdTime: {
    type: Date
  },
  lastUpdateUser: {
    type: String
  },
  lastUpdateTime: {
    type: Date
  }
});

var ticketOffice = mongoose.model("ticket_office", ticketOfficeSchema);
module.exports = ticketOffice;
