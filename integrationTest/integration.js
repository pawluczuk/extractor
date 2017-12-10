const child_process = require('child_process')
  , mongoose = require('mongoose')
  , async = require('async')
  , assert = require('assert')
  , _ = require('lodash')
  , models = require('../models')
  , dbUri = 'mongodb://localhost/extractorTest'
  ;

mongoose.Promise = global.Promise;

const env = Object.assign({}, process.env, {MONGO_URI: dbUri});
const proc = child_process.spawn(process.execPath, ['index.js', 'integrationTest/testData'], {env});

const expectedBooksData = {
  0: {
    license: 'http://www.gnu.org/licenses/gpl.html'
    , language: 'en'
    , subject: []
    , publisher: 'Project Gutenberg'
    , creator: []
    , id: 0
  }
  , 1: {
    license: 'https://creativecommons.org/publicdomain/zero/1.0/'
    , language: 'en'
    , title: 'The Declaration of Independence of the United States of America',
    id: 1,
    subject:
    ['United States -- History -- Revolution, 1775-1783 -- Sources',
      'E201',
      'JK',
      'United States. Declaration of Independence'],
    publisher: 'Project Gutenberg',
    creator: ['Jefferson, Thomas']
  }
  , 2: {
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    language: 'en',
    title: 'The United States Bill of Rights\r\nThe Ten Original Amendments to the Constitution of the United States',
    id: 2,
    subject:
     ['Civil rights -- United States -- Sources',
       'KF',
       'United States. Constitution. 1st-10th Amendments',
       'JK'],
    publisher: 'Project Gutenberg',
    creator: ['United States']
  }
  , 3: {
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    language: 'en',
    title: 'John F. Kennedy\'s Inaugural Address',
    id: 3,
    subject:
     ['United States -- Foreign relations -- 1961-1963',
       'Presidents -- United States -- Inaugural addresses',
       'E838'],
    publisher: 'Project Gutenberg',
    creator: ['Kennedy, John F. (John Fitzgerald)']
  }
  , 4: {
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    language: 'en',
    title: 'Lincoln\'s Gettysburg Address\r\nGiven November 19, 1863 on the battlefield near Gettysburg, Pennsylvania, USA',
    id: 4,
    subject:
     ['Consecration of cemeteries -- Pennsylvania -- Gettysburg',
       'Soldiers\' National Cemetery (Gettysburg, Pa.)',
       'E456',
       'Lincoln, Abraham, 1809-1865. Gettysburg address'],
    publisher: 'Project Gutenberg',
    creator: ['Lincoln, Abraham']
  }
  , 5: {
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    language: 'en',
    title: 'The United States Constitution',
    id: 5,
    subject:
     ['United States -- Politics and government -- 1783-1789 -- Sources',
       'JK',
       'United States. Constitution',
       'KF'],
    publisher: 'Project Gutenberg',
    creator: ['United States']
  }
};

function checkLogs(next) {
  models.Logs.count({}).exec((err, count) => {
    try {
      assert(!err, 'logs err');
      assert.strictEqual(count, 0, 'logs have documents inserted');
      console.info('Log data is correct.');
      next();
    } catch(ex) {
      console.error(ex);
      next(ex);
    }
  });
}

function checkBooks(next) {
  models.Books.find({}).lean().exec((err, books) => {
    try {
      assert(!err, 'books err');
      assert.strictEqual(books.length, 6, 'books have incorrect number of documents');
      books.forEach((book) => {
        assert.deepStrictEqual(
          expectedBooksData[book.id]
          , _.omit(book, ['__v', '_id', 'createdAt', 'updatedAt'])
          , `book ${book.id} had incorrect values`
        );
      });
      console.info('Book data is correct.');
      next();
    } catch(ex) {
      console.error(ex);
      next(ex);
    }
  });
}

function checkResults(code, cb) {
  try {
    assert.strictEqual(code, 0);
    console.info('Process exited with code 0');
  
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUri, {
      useMongoClient: true
    });
  
    async.waterfall([
      checkLogs
      , checkBooks
    ], (err) => {
      mongoose.connection.dropDatabase((dropErr) => {
        assert(!dropErr, 'error dropping test database');
        if (dropErr) {
          console.error('Need to manually destroy test database.');
        }
        if (err) {
          console.error('Invalid data, checks have not been successful.');
        } else {
          console.info('All results were as expected. Destroyed test database.');
        }
        cb();
      });
    });
  } catch (ex) {
    mongoose.connection.dropDatabase();
  } 
}

proc.stdout.pipe(process.stdout)
proc.stderr.pipe(process.stderr)

proc.on('close', function(code) {
  checkResults(code, () => {
    process.exit(0);
  });
})
