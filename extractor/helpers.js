'use strict';

const _ = require('lodash')
  , debug = require('debug')('extractor:helpers')
  , helpers = {};

helpers.getPublisher = (publisherData) => {
  return _.first(publisherData);
};

helpers.getTitle = (titleData) => {
  return _.first(titleData);
};

helpers.getLanguage = (languageData) => {
  languageData = _.first(languageData);
  if (languageData['rdf:Description']) {
    languageData = _.first(languageData['rdf:Description']);
    languageData = _.first(languageData['rdf:value']);
  }
  return languageData._;
};

helpers.getSubject = (subjectData) => {
  const subjects = [];
  (subjectData || []).forEach((subjectDescription) => {
    subjectDescription = _.first(subjectDescription['rdf:Description']);
    subjects.push(_.first(subjectDescription['rdf:value']));
  });
  return subjects;
};

helpers.getCreator = (creatorData) => {
  const creators = [];
  (creatorData || []).forEach((creatorDescription) => {
    const creator = _.first(creatorDescription['pgterms:agent']);
    if (creator) {
      creators.push(_.first(creator['pgterms:name']));
    }
  });
  return creators;
};

helpers.getLicense = (licenseData) => {
  //TODO
  licenseData = _.first(licenseData);
  const assert = require('assert');
  return 'http://licenseUrl.com';
};

helpers.getId = (data) => {
  const bookIdentifier = data['rdf:about'] || '';
  return parseInt(bookIdentifier.replace('ebooks/', ''));
}

helpers.getBookInfo = (data) => {
  const bookInfo = {};
  Object.keys(data).forEach((property) => {
    const dataProcessor = helpers[`get${_.startCase(property)}`];
    if (dataProcessor) {
      bookInfo[property] = dataProcessor(data[property]);
    }
  });

  bookInfo.id = helpers.getId(data.$);
  debug('book info', bookInfo);
  return bookInfo;
};

module.exports = helpers;
