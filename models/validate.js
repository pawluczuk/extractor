
'use strict';

const urlRegex = /^((http|https):)?\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;

function validateId(id) {
  id = parseInt(id);
  return !isNaN(id) && id >= 0 && id <= 99999;
}

function validateUrl(url) {
  return urlRegex.test(url);
}

module.exports = {
  id: validateId
  , url: validateUrl
};
