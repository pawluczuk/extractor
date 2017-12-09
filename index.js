'use strict';
const mongoose = require('mongoose')
  , path = require('path')
  , fs = require('fs')
  , async = require('async')
  , cluster = require('cluster')
  , models = require('./models')
  , debug = require('debug')('extractor:index')
  , extractor = require('./extractor')({models})
  , db = process.env.MONGO_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/extractor'
  , DIRECTORY = process.argv.length >= 3 ? process.argv[2] : '../rdfs/epub'
  , PROCESS_MAX_OPEN_FILES = process.argv.length >= 4 ? process.argv[3] : 2000
  , WORKERS_NUMBER = require('os').cpus().length
  ;

mongoose.Promise = global.Promise;
mongoose.connect(db, {
  useMongoClient: true
});

const closeConnection = () => {
  return mongoose.disconnect(() => {
    process.exit();
  });
}

const finish = () => {
  mongoose.logs.count({}).exec((err, count) => {
    if (err) {
      return closeConnection();
    }
    console.log(`Found ${count} errors in logs collection.`);
    return closeConnection();
  });
}

const getFilePaths = (dirs) => {
  return (dirs || [])
    .filter(d => !d.startsWith('.'))
    .map(d => path.join(DIRECTORY, d, `pg${d}.rdf`));
}

fs.readdir(DIRECTORY, (err, dirs) => {

  if (err) {
    console.error(err);
    return closeConnection();
  }

  if (cluster.isMaster) {
    console.time('processing');

    let currentlyWorking = 0;
    const fileList = getFilePaths(dirs);

    for (let i = 0; i < WORKERS_NUMBER; i++) {
      cluster.fork();
    }

    cluster.on('online', function(worker) {
      debug('Worker ' + worker.process.pid + ' is online');
      currentlyWorking += 1;
    });

    cluster.on('exit', function(worker, code, signal) {
      debug(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
      if (fileList.length) {
        debug('Something went wrong. Starting a new worker');
        cluster.fork();
      }
      else {
        currentlyWorking -= 1;
        debug('Still working ', currentlyWorking)
        if (!currentlyWorking) {
          debug('All workers finished working');
          console.timeEnd('processing');
          finish();
        }
      }
    });

    cluster.on('message', function(worker, code) {
      debug('Master received message', code);
      if (['finish', 'ready'].indexOf(code) > -1) {
        debug('Master sending new file. Left files:', fileList.length);
        if (fileList.length) {
          // send new batch of files to waiting process
          worker.send({
            type: 'processfile',
            files: fileList.splice(0, Math.min(fileList.length, PROCESS_MAX_OPEN_FILES))
          });
        }
        else {
          // no more files to process, process can be closed
          worker.send({
            type: 'done'
          });
        }
      }
    });
  }
  else {
    process.send('ready');

    process.on('message', function(task) {
      if (task.type === 'processfile') {
        async.eachLimit(task.files, PROCESS_MAX_OPEN_FILES, extractor.processMetadata, (err) => {
          debug('processMetadata err', err);
          process.send('finish');
        });
      }
      else if (task.type === 'done') {
        process.exit();
      }
    });
  }

});
