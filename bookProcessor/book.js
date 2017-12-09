'use strict';

const _ = require('lodash')
  , debug = require('debug')('extractor:book');

class Book {
  constructor(data) {
    this.data = data || {};
    this.bookInfo = this.getBookInfo();
  }

  getPublisher() {
    const publisher = this.data.publisher;
    return _.first(publisher);
  }

  getTitle() {
    const title = this.data.title;
    return _.first(title);
  }

  getId() {
    const bookIdentifier = this.data.$['rdf:about'] || '';
    return parseInt(bookIdentifier.replace('ebooks/', ''));
  }

  getLanguage() {
    let languageData = _.first(this.data.language);
    if (languageData) {
      if (languageData['rdf:Description']) {
        languageData = _.first(languageData['rdf:Description']);
        languageData = _.first(languageData['rdf:value']);
      }
      return languageData._;
    }
    return undefined;
  }

  getSubject() {
    const subjects = [];
    (this.data.subject || []).forEach((subjectDescription) => {
      if (subjectDescription['rdf:Description']) {
        subjectDescription = _.first(subjectDescription['rdf:Description']);
        subjects.push(_.first(subjectDescription['rdf:value']));
      }
    });
    return subjects;
  }

  getCreator() {
    const creators = [];
    (this.data.creator || []).forEach((creatorDescription) => {
      if (creatorDescription['pgterms:agent']) {
        const creator = _.first(creatorDescription['pgterms:agent']);
        creators.push(_.first(creator['pgterms:name']));
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
