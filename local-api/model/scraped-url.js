const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  urls: {
    type: [String],
  },
});

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;
