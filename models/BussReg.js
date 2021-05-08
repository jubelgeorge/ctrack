const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema;

const BussRegSchema = new mongoose.Schema({  
  name: {
    type: String,
    //required: true
  },
  email: {
    type: String,
    //required: true,
    //unique: true     //Set to true so that no two same email account cannot be registered
  },
  doneBy: {
    type: ObjectId,
    ref: 'user'
  },  
  date: {
    type: Date,
    default: Date.now  
  }
});

module.exports = mongoose.model('bussReg', BussRegSchema);