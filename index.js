'use strict';
const mongoose = require('mongoose')
  , path = require('path')
  , fs = require('fs')
  , async = require('async')
  , models = require('./models')
  , debug = require('debug')('extractor:index')
  , extractor = require('./extractor')({models})
  , db = process.env.MONGO_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/extractor'
  , DIRECTORY = process.argv.length >= 3 ? process.argv[2] : '../rdfs/epub'
  , PROCESS_MAX_OPEN_FILES = process.argv.length >= 4 ? process.argv[3] : 1000
  ;

mongoose.Promise = global.Promise;
mongoose.connect(db, {
  useMongoClient: true
});

fs.readdir(DIRECTORY, (err, dirs) => {

  if (err) {
    console.error(err);
    mongoose.disconnect();
    process.exit(0);
  }

  const fileList = (dirs || [])
    .filter(d => !d.startsWith('.'))
    .map(d => path.join(DIRECTORY, d, `pg${d}.rdf`));

  async.everyLimit(fileList, PROCESS_MAX_OPEN_FILES, extractor.processMetadata, (err) => {
    console.log(err)
    //console.log(results)
    mongoose.disconnect();
  });
});
