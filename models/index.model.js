var mongoose = require("mongoose");

var Schema = mongoose.Schema; //dinh nghia 1 kieu cau truc cho mongo

var indexSchema = new Schema({
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
  companyName: {
    type: String
  }
});

var Index = mongoose.model("index", indexSchema);
module.exports = Index;
