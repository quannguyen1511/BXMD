var mongoose = require("mongoose");

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
  }
});

var User = mongoose.model("user", userSchema);
module.exports = User;
