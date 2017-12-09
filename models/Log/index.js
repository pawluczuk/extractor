'use strict';

const mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;

const log = new Schema({
  file: {type: String}
  , error: {}
}, {
  timestamps: true
});

module.exports = mongoose.model('Log', log);
