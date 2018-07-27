var mongoose = require("mongoose");

var Schema = mongoose.Schema; //dinh nghia 1 kieu cau truc cho mongo

var parkingLotSchema = new Schema({
  col: {
    type: Number,
    required: true
  },
  row: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  rentedDate: {
    type: Date
  },
  expirationDate: {
    type: Date
  },
  renter: {
    type: String
  },
  carNumber: {
    type: String
  },
  companyTaxID: {
    type: String
  },
  location: {
    type: Number
  },
  createdBy: {
    type: String,
    required: true
  },
  createdTime: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  },
  updatedTime: {
    type: String,
    required: true
  }
});

var parkingLot = mongoose.model("parkingLot", parkingLotSchema);
module.exports = parkingLot;
