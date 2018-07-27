var mongoose = require("mongoose");
var config = require("./../config");

var Schema = mongoose.Schema; //dinh nghia 1 kieu cau truc cho mongo

var userSchema = new Schema({
  email: {
    type: String,
    required: true //bat buoc
  },
  salt: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    required: true,
    default: config.ROLE.USER
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

var User = mongoose.model("user", userSchema);
module.exports = User;
