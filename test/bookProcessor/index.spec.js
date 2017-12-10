/* eslint-env mocha */
'use strict';

const assert = require('assert')
  , sinon = require('sinon')
  ;

describe('bookProcessor/index', () => {
  describe('constructor', () => {
    it('should work with models specified', () => {
      const processor = require('../../bookProcessor')({models: {my: 'models'}});
      assert(typeof processor.processFile === 'function');
    })

    it('should work without models specified', () => {
      const processor = require('../../bookProcessor')({});
      assert(typeof processor.processFile === 'function');
    })
  })

  describe('processFile', () => {
    let processor, models, logsData, booksData, booksSaveErr, logsSaveErr, fsReadStub;
    const fs = require('fs')
      , path = require('path')
      , sampleFile = fs.readFileSync(path.resolve('test/testData/sample.rdf'))
      , invalidXMLFile = fs.readFileSync(path.resolve('test/testData/invalidxml.rdf'))
      , emptyEbookFile = fs.readFileSync(path.resolve('test/testData/empty.rdf'));

    before(() => {
      models = {
        Logs: function Log(data) {
          logsData.push(data);
          this.save = (cb) => {
            cb(logsSaveErr);
          }
        }
        , Books: function Book(data) {
          booksData.push(data);
          this.save = (cb) => {
            cb(booksSaveErr);
          }
        }
      };

      fsReadStub = sinon.stub(fs, 'readFile');
      processor = require('../../bookProcessor')({models});
    })

    beforeEach(() => {
      logsSaveErr = null;
      booksSaveErr = null;
      logsData = [];
      booksData = [];
    })

    afterEach(() => {
      fsReadStub.reset();
    })

    after(() => {
      fsReadStub.restore();
    })

    it('should work', (done) => {
      fsReadStub.yields(null, sampleFile);
      processor.processFile('file.rdf', (err) => {
        assert(!err);
        assert(!logsData.length);
        assert.deepStrictEqual(booksData[0], {
          publisher: 'Project Gutenberg',
          language: 'en',
          title: 'Earthwork Slips and Subsidences upon Public Works Their Causes, Prevention, and Reparation',
          subject: [],
          creator: ['Newman, John Henry'],
          license: 'https://creativecommons.org/publicdomain/zero/1.0/',
          id: 56132
        });
        done();
      });
    });
    it('should work with empty ebook data', (done) => {
      fsReadStub.yields(null, emptyEbookFile);
      processor.processFile('file.rdf', (err) => {
        assert(!err);
        assert(!logsData.length);
        assert.deepStrictEqual(booksData[0], {
          publisher: undefined,
          language: undefined,
          title: undefined,
          subject: [],
          creator: [],
          license: 'https://creativecommons.org/publicdomain/zero/1.0/',
          id: 56132
        });
        done();
      });
    });
    it('should fail with invalid xml and push it to logs', (done) => {
      fsReadStub.yields(null, invalidXMLFile);
      processor.processFile('file.rdf', (err) => {
        assert(!err);
        assert.strictEqual(logsData[0].file, path.resolve('file.rdf'));
        assert.strictEqual(logsData[0].error.message, 'Unexpected close tag\nLine: 10\nColumn: 28\nChar: >');
        done();
      });
    });

    it('should fail on fs read fail and push it to logs', (done) => {
      fsReadStub.yields('FS ERROR');
      processor.processFile('file.rdf', (err) => {
        assert(!err);
        assert.deepStrictEqual(logsData[0], {error: 'FS ERROR', file: path.resolve('file.rdf')});
        done();
      });
    });

    it('should fail on saving new book fail', (done) => {
      fsReadStub.yields(null, sampleFile);
      booksSaveErr = 'save err';
      processor.processFile('file.rdf', (err) => {
        assert(!err);
        assert.deepStrictEqual(logsData[0], {error: 'save err', file: path.resolve('file.rdf')});
        done();
      });
    })
  })
})
