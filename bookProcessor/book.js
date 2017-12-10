'use strict';

const _ = require('lodash')
  , debug = require('debug')('extractor:book');

class Book {
  constructor(data) {
    this.data = data || {};
    this.bookInfo = this.getBookInfo();
  }

  getPublisher() {
    const publisher = _.get(this, 'data.publisher', []);
    return _.first(publisher);
  }

  getTitle() {
    const title = _.get(this, 'data.title', []);
    return _.first(title);
  }

  getId() {
    const bookIdentifier = _.get(this, 'data.$["rdf:about"]', '');
    return parseInt(bookIdentifier.replace('ebooks/', ''));
  }

  getLanguage() {
    const language = _.get(this, 'data.language', []);
    let languageData = _.first(language);
    if (languageData) {
      if (languageData['rdf:Description']) {
        languageData = _.get(languageData, '["rdf:Description"][0]["rdf:value"][0]', {})
      }
      return languageData._;
    }
    return undefined;
  }

  getSubject() {
    const subjects = [];
    (this.data.subject || []).forEach((subjectDescription) => {
      subjectDescription = _.get(subjectDescription, '["rdf:Description"][0]["rdf:value"][0]');
      if (subjectDescription) {
        subjects.push(subjectDescription);
      }
    });
    return subjects;
  }

  getCreator() {
    const creators = [];
    (this.data.creator || []).forEach((creatorDescription) => {
      creatorDescription = _.get(creatorDescription, '["pgterms:agent"][0]["pgterms:name"][0]');
      if (creatorDescription) {
        creators.push(creatorDescription);
      }
    });
    return creators;
  }

  getLicense() {
    //TODO
    //licenseData = _.first(this.data.license);
    return 'http://licenseUrl.com';
  }

  getBookInfo() {
    const bookInfo = {};
    Object.keys(this.data).forEach((property) => {
      const dataProcessor = `get${_.startCase(property)}`;
      if (this[dataProcessor]) {
        bookInfo[property] = this[dataProcessor]();
      }
    });

    bookInfo.id = this.getId();
    debug('book info', bookInfo);
    return bookInfo;
  }
}

module.exports = Book;
