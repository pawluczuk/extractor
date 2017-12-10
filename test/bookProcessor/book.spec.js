/* eslint-env mocha */
'use strict';

const assert = require('assert')
  , Book = require('../../bookProcessor/book')
  ;

describe('bookProcessor/book', () => {
  let data;
  beforeEach(() => {
    data = {
      'publisher': [
        'Project Gutenberg'
      ],
      'language': [
        {
          'rdf:Description': [
            {
              '$': {
                'rdf:nodeID': 'N2b86c067bff44b799db939c014093362'
              },
              'rdf:value': [
                {
                  '_': 'en',
                  '$': {
                    'rdf:datatype': 'http://purl.org/dc/terms/RFC4646'
                  }
                }
              ]
            }
          ]
        }
      ],
      'title': [
        'The Bickerstaff-Partridge Papers'
      ],
      'subject': [
        {
          'rdf:Description': [
            {
              '$': {
                'rdf:nodeID': 'N38c0d7720cd240dc895dcd25539989f1'
              },
              'dcam:memberOf': [
                {
                  '$': {
                    'rdf:resource': 'http://purl.org/dc/terms/LCSH'
                  }
                }
              ],
              'rdf:value': [
                'Satire, English'
              ]
            }
          ]
        },
        {
          'rdf:Description': [
            {
              '$': {
                'rdf:nodeID': 'N2d821687098a43f5b21c0eaac506a5d0'
              },
              'rdf:value': [
                'PR'
              ],
              'dcam:memberOf': [
                {
                  '$': {
                    'rdf:resource': 'http://purl.org/dc/terms/LCC'
                  }
                }
              ]
            }
          ]
        }
      ],
      'creator': [
        {
          'pgterms:agent': [
            {
              '$': {
                'rdf:about': '2009/agents/326'
              },
              'pgterms:webpage': [
                {
                  '$': {
                    'rdf:resource': 'http://en.wikipedia.org/wiki/Jonathan_Swift'
                  }
                }
              ],
              'pgterms:birthdate': [
                {
                  '_': '1667',
                  '$': {
                    'rdf:datatype': 'http://www.w3.org/2001/XMLSchema#integer'
                  }
                }
              ],
              'pgterms:name': [
                'Swift, Jonathan'
              ],
              'pgterms:alias': [
                'Swift, J. (Jonathan)'
              ],
              'pgterms:deathdate': [
                {
                  '_': '1745',
                  '$': {
                    'rdf:datatype': 'http://www.w3.org/2001/XMLSchema#integer'
                  }
                }
              ]
            }
          ]
        }
      ],
      'license': [
        {
          '$': {
            'rdf:resource': 'http://licenseUrl.com'
          }
        }
      ],
      '$': {
        'rdf:about': 'ebooks/1090'
      }
    };
  });

  describe('constructor', () => {
    it('should pass data', () => {
      const constructorData = {'abc': 'de'};
      const book = new Book(constructorData);
      assert.deepStrictEqual(book.data, constructorData);
    });
    it('should default to empty object', () => {
      const book = new Book();
      assert.deepStrictEqual(book.data, {});
    });
  })

  describe('getBookInfo', () => {
    it('should work', () => {
      const expectedData = {
        publisher: 'Project Gutenberg',
        language: 'en',
        title: 'The Bickerstaff-Partridge Papers',
        subject: ['Satire, English', 'PR'],
        creator: ['Swift, Jonathan'],
        license: 'http://licenseUrl.com',
        id: 1090
      };

      const book = new Book(data);
      assert.deepStrictEqual(book.bookInfo, expectedData);
      assert.deepStrictEqual(book.getBookInfo(), expectedData);
    });
  })
  describe('getLicense', () => {
    it('should return license', () => {
      const book = new Book(data);
      assert.strictEqual(book.getLicense(), 'http://licenseUrl.com');
    })
  })

  describe('getId', () => {
    it('should return id', () => {
      const book = new Book(data);
      assert.strictEqual(book.getId(), 1090);
    })
    it('should return NaN string if no data', () => {
      data.$ = {};
      const book = new Book(data);
      assert(isNaN(book.getId()));
    })
  })

  describe('getCreator', () => {
    it('should return an array of subjects', () => {
      data.creator = [
        {'pgterms:agent': [{'pgterms:name': ['abc']}]}
        , {'pgterms:agent': [{'pgterms:name': ['def']}]}
      ];
      const book = new Book(data);
      assert.deepStrictEqual(book.getCreator(), ['abc', 'def']);
    })

    it('should ignore incorrect data', () => {
      data.creator = [{some: 'data'}];
      const book = new Book(data);
      assert.deepStrictEqual(book.getCreator(), []);
    })

    it('should return empty array if empty array', () => {
      data.creator = [];
      const book = new Book(data);
      assert.deepStrictEqual(book.getCreator(), []);
    })

    it('should return empty array if no data', () => {
      data.creator = undefined;
      const book = new Book(data);
      assert.deepStrictEqual(book.getCreator(), []);
    })
  })

  describe('getSubject', () => {
    it('should return an array of subjects', () => {
      data.subject = [
        {'rdf:Description': [{'rdf:value': ['abc']}]}
        , {'rdf:Description': [{'rdf:value': ['def']}]}
      ];
      const book = new Book(data);
      assert.deepStrictEqual(book.getSubject(), ['abc', 'def']);
    })

    it('should ignore incorrect data', () => {
      data.subject = [{some: 'data'}];
      const book = new Book(data);
      assert.deepStrictEqual(book.getSubject(), []);
    })

    it('should return empty array if no data', () => {
      data.subject = undefined;
      const book = new Book(data);
      assert.deepStrictEqual(book.getSubject(), []);
    })

    it('should return empty array if empty array', () => {
      data.subject = [];
      const book = new Book(data);
      assert.deepStrictEqual(book.getSubject(), []);
    })
  });

  describe('getLanguage', () => {
    it('should return language', () => {
      data.language = [{
        'rdf:Description': [{'rdf:value': [{_: 'en'}]}]
      }];
      const book = new Book(data);
      data.language = [{_: 'en'}];
      const otherBook = new Book(data);
      assert.strictEqual(book.getLanguage(), 'en');
      assert.strictEqual(otherBook.getLanguage(), 'en');
    })

    it('should return nothing if no data', () => {
      data.language = [];
      const book = new Book(data);
      assert.strictEqual(book.getLanguage(), undefined);
    })
  })

  describe('getTitle', () => {
    it('should return title', () => {
      data.title = ['abc'];
      const book = new Book(data);
      assert.strictEqual(book.getTitle(), 'abc');
    })

    it('should return nothing if no data', () => {
      data.title = {};
      const book = new Book(data);
      assert.strictEqual(book.getTitle(), undefined);
    })
  })

  describe('getPublisher', () => {
    it('should return publisher', () => {
      data.publisher = ['abc'];
      const book = new Book(data);
      assert.strictEqual(book.getPublisher(), 'abc');
    })

    it('should return nothing if no data', () => {
      data.publisher = {};
      const book = new Book(data);
      assert.strictEqual(book.getPublisher(), undefined);
    })
  })
});
