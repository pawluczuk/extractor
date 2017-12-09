'use strict';

const mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , constants = require('../constants')
  , validate = require('../validate')
  ;

const book = new Schema({
  id: {
    type: Number
    , validate: [validate.id, 'Invalid id']
    , required: true
    , unique: true
  }
  , title: {
    type: String
  }
  , creator: [{
    type: String
  }]
  , publisher: {
    type: String
    , default: 'Project Gutenberg'
  }
  , language: {
    type: String
    , enum: constants.languages
  }
  , subject: [{
    type: String
  }]
  , license: {
    type: String
    , validate: [validate.url, 'Invalid license url']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', book);
