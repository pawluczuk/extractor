/* eslint-env mocha */
'use strict';

const assert = require('assert')
  , validate = require('../../models/validate');

describe('validate', () => {
  it('validateId', () => {
    assert(validate.id(123));
    assert(!validate.id(''));
    assert(!validate.id(-1));
    assert(!validate.id(9999999));
  })
  it('validateUrl', () => {
    assert(validate.url('http://google.com'));
    assert(!validate.url(123));
  })
})
