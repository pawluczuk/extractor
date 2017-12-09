const fs = require('fs')
  , async = require('async')
  , path = require('path')
  , parseString = require('xml2js').parseString
  , debug = require('debug')('extractor:lib')
  , helpers = require('./helpers')
  ;

let models;

const logError = (error, file, cb) => {
  const log = new models.logs({error, file});
  log.save(cb);
}

/**
 * Reads file from disk and parses it's XML content to JSON
 * @param {string} filePath file directory to read from
 * @param {function} cb callback
 */
const parseFile = (filePath, cb) => {
  debug('reading file', filePath);
  fs.readFile(filePath, 'utf-8', (err, file) => {
    if (err) {
      debug('err reading file', err);
      return cb(err);
    }
    parseString(file, (err, parsedString) => {
      if (err) {
        debug('err parsing XML', err);
        return cb(err);
      }
      parsedString.filePath = filePath;
      return cb(null, parsedString);
    });
  });
}

/**
 * Returns subset of needed properties of an object
 * @param {JSON} parsedString parsed XML object
 * @param {function} cb callback
 */
const extractRequiredFields = (parsedString, cb) => {
  parsedString = parsedString['rdf:RDF']['pgterms:ebook'][0] || {};

  const dcTermsFields = ['publisher', 'language', 'title', 'subject', 'creator', 'license']
    , termFields = ['$']
    , result = {};

  dcTermsFields.forEach((field) => {
    result[field] = parsedString[`dcterms:${field}`];
  });

  termFields.forEach((field) => {
    result[field] = parsedString[field];
  });
  return cb(null, result);
}

/**
 * Gets book info and returns object ready to save to db
 * @param {JSON} data parsed XML object
 * @param {function} cb callback
 */
const parseFields = (data, cb) => {
  const bookInfo = helpers.getBookInfo(data);
  return cb(null, bookInfo);
};

const saveToDatabase = (bookInfo, cb) => {
  debug('saving book info to db');
  const book = new models.books(bookInfo);
  book.save(cb);
};

const processMetadata = (filePath, callback) => {
  const init = (cb) => {
    return cb(null, filePath);
  }

  const finish = (err) => {
    if (err) {
      debug('file extraction err', err, filePath);
      // log error to db and continue
      return logError(err, path.resolve(filePath), callback);
    }
    return callback(null);
  };

  async.waterfall([
    init
    , parseFile
    , extractRequiredFields
    , parseFields
    , saveToDatabase
  ], finish);
};

module.exports = (opts) => {
  models = opts.models || require('../models');
  return {
    processMetadata
  };
};
