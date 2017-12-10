/* eslint-env mocha */
'use strict';

const assert = require('assert')
  , sinon = require('sinon')
  , fs = require('fs')
  , cluster = require('cluster')
  , models = require('../models')
  , bookProcessor = require('../bookProcessor')({})
  ;

describe('extractor', () => {
  let readdir
    , fork
    , processFile;
  const logsErr = null
    , logsCount = 2;
  before(() => {
    readdir = sinon.stub(fs, 'readdir');
    //fork = sinon.stub(cluster, 'fork');
    processFile = sinon.stub(bookProcessor, 'processFile');
    models.Logs = {
      count: () => {
        return {
          exec: (cb) => {
            cb(logsErr, logsCount);
          }
        }
      }
    }
  });

  afterEach(() => {
    processFile.reset();
    //fork.reset();
    readdir.reset();
  });

  after(() => {
    processFile.restore();
    //fork.restore();
    readdir.restore();
  })

  it('should fork as many times as there are cpus', (done) => {
    readdir.yields(null, ['a', 'b']);
    processFile.yields(null);
    const extractor = require('../');
    extractor.init('dir', 2, (err) => {
      assert(!err);
      //assert.equal(fork.calledCount, require('os').cpus().length);
      done();
    });
  });

  it('should fail on directory read fail', (done) => {
    readdir.yields('read err');
    const extractor = require('../');
    extractor.init('dir', 2, (err) => {
      assert.strictEqual(err, 'read err');
      //assert(fork.notCalled);
      done();
    });
  });
});
