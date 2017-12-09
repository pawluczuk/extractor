/* eslint-env mocha */
'use strict';

const assert = require('assert')
  , Book = require('../../extractor/book')
  ;

describe('extractor/book', () => {
  /*describe('getPublisher', () => {
    it('should return publisher', () => {
      const book = newBook
      assert.strictEqual(helpers.getPublisher(['abc']), 'abc');
    })

    it('should return nothing if no data', () => {
      assert.strictEqual(helpers.getPublisher(), undefined);
      assert.strictEqual(helpers.getPublisher([]), undefined);
    })
  })

  describe('getTitle', () => {
    it('should return title', () => {
      assert.strictEqual(helpers.getTitle(['abc']), 'abc');
    })

    it('should return nothing if no data', () => {
      assert.strictEqual(helpers.getTitle(), undefined);
      assert.strictEqual(helpers.getTitle([]), undefined);
    })
  })

  describe('getLanguage', () => {
    it('should return language', () => {
      const data = [{
        'rdf:Description': [{'rdf:value': [{_: 'en'}]}]
      }];
      const otherData = [{_: 'en'}];
      assert.strictEqual(helpers.getLanguage(data), 'en');
      assert.strictEqual(helpers.getLanguage(otherData), 'en');
    })

    it('should return nothing if no data', () => {
      assert.strictEqual(helpers.getLanguage(), undefined);
      assert.strictEqual(helpers.getLanguage([]), undefined);
    })
  })

  describe('getSubject', () => {
    it('should return an array of subjects', () => {
      const data = [
        {'rdf:Description': [{'rdf:value': ['abc']}]}
        , {'rdf:Description': [{'rdf:value': ['def']}]}
      ];
      assert.deepStrictEqual(helpers.getSubject(data), ['abc', 'def']);
    })

    it('should return empty array if no data', () => {
      assert.deepStrictEqual(helpers.getSubject(), []);
      assert.deepStrictEqual(helpers.getSubject([]), []);
      assert.deepStrictEqual(helpers.getSubject([{}]), []);
    })
  });

  describe('getCreator', () => {
    it('should return an array of subjects', () => {
      const data = [
        {'pgterms:agent': [{'pgterms:name': ['abc']}]}
        , {'pgterms:agent': [{'pgterms:name': ['def']}]}
      ];
      assert.deepStrictEqual(helpers.getCreator(data), ['abc', 'def']);
    })

    it('should return empty array if no data', () => {
      assert.deepStrictEqual(helpers.getCreator(), []);
      assert.deepStrictEqual(helpers.getCreator([]), []);
      assert.deepStrictEqual(helpers.getCreator([{}]), []);
    })
  })

  // TODO
  describe('getLicense', () => {
    it('should return license', () => {
      assert.strictEqual(helpers.getLicense('abc'), 'http://licenseUrl.com');
    })
  })

  describe('getId', () => {
    it('should return id', () => {
      assert.strictEqual(helpers.getId({'rdf:about': 'ebooks/3'}), 3);
    });
    it('should return NaN string if no data', () => {
      assert(isNaN(helpers.getId({})));
      assert(isNaN(helpers.getId({'rdf:about': 'abc'})));
      assert(isNaN(helpers.getId()));
    });
  });*/

  describe('getBookInfo', () => {
    it('should work', () => {
      const data = {
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
              'rdf:resource': 'license'
            }
          }
        ],
        '$': {
          'rdf:about': 'ebooks/1090'
        }
      };
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
      assert.deepStrictEqual(book.getBookInfo(data), expectedData);
    })
  })
});
