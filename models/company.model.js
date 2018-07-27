var mongoose = require("mongoose");

///////////
var Schema = mongoose.Schema;
var companySchema = new Schema({
  taxID: {
    type: String
  },
  companyName: {
    type: String
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  status: {
    type: Number,
    required: true
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

var company = mongoose.model("company", companySchema);
module.exports = company;
