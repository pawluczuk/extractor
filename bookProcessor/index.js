'use strict';

const fs = require('fs')
  , async = require('async')
  , path = require('path')
  , _ = require('lodash')
  , parseString = require('xml2js').parseString
  , debug = require('debug')('extractor:lib')
  , Book = require('./book')
  ;

let models;

function logError(error, file, cb) {
  const log = new models.Logs({error, file});
  log.save(cb);
}

/**
 * Reads file from disk and parses it's XML content to JSON
 * @param {string} filePath file directory to read from
 * @param {function} cb callback
 */
function parseFile(filePath, cb) {
  debug('reading file', filePath);
  fs.readFile(filePath, 'utf-8', (err, file) => {
    if (err) {
      debug('err reading file', err);
      return cb(err);
    }
    parseString(file, (err, jsonXML) => {
      if (err) {
        debug('err parsing XML', err);
        return cb(err);
      }
      jsonXML.filePath = filePath;
      return cb(null, jsonXML);
    });
  });
}

/**
 * Returns subset of needed properties of an object
 * @param {JSON} parsedString parsed XML object
 * @param {function} cb callback
 */
function extractRequiredFields(parsedString, cb) {
  const licenseData = _.get(parsedString, '["rdf:RDF"]["cc:Work"][0]', {})
    , ebookData = _.get(parsedString, '["rdf:RDF"]["pgterms:ebook"][0]', {})
    , dcTermsFields = ['publisher', 'language', 'title', 'subject', 'creator']
    , termFields = ['$']
    , licenseFields = ['license']
    , result = {};

  licenseFields.forEach((field) => {
    result[field] = licenseData[`cc:${field}`]
  });

  dcTermsFields.forEach((field) => {
    result[field] = ebookData[`dcterms:${field}`];
  });

  termFields.forEach((field) => {
    result[field] = ebookData[field];
  });
  return cb(null, result);
}

/**
 * Gets book info and returns object ready to save to db
 * @param {JSON} data parsed XML object
 * @param {function} cb callback
 */
function parseFields(data, cb) {
  debug('parseFields', JSON.stringify(data, null, 2));
  const book = new Book(data)
    , info = book.bookInfo
    ;
  return cb(null, info);
}

function saveToDatabase(bookInfo, cb) {
  debug('saving book info to db');
  const book = new models.Books(bookInfo);
  book.save(cb);
}

function processFile(filePath, callback) {

  function init(cb) {
    return cb(null, filePath);
  }

  function finish(err) {
    if (err) {
      debug('file extraction err', err, filePath);
      // log error to db and continue
      return logError(err, path.resolve(filePath), callback);
    }
    return callback(null);
  }

  async.waterfall([
    init
    , parseFile
    , extractRequiredFields
    , parseFields
    , saveToDatabase
  ], finish);
}

module.exports = (opts) => {
  models = opts.models || require('../models');
  return {
    processFile
  };
};
