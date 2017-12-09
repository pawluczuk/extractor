'use strict';
const mongoose = require('mongoose')
  , path = require('path')
  , fs = require('fs')
  , async = require('async')
  , models = require('./models')
  , extractor = require('./extractor')({models})
  , db = process.env.MONGO_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/extractor'
  , MAX_OPEN_FILES = 5000
  ;

mongoose.Promise = global.Promise;
mongoose.connect(db, {
  useMongoClient: true
});

const dir = path.join('../rdfs/epub');

fs.readdir(dir, (err, dirs) => {
  const fileList = dirs
    .filter(d => !d.startsWith('.'))
    .map(d => path.join(dir, d, `pg${d}.rdf`));

  async.everyLimit(fileList, 1000, extractor.processMetadata, (err) => {
    console.log(err)
    //console.log(results)
    mongoose.disconnect();
  });
});
