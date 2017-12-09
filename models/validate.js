
const validateId = (id) => {
  id = parseInt(id);
  return !isNaN(id) && id >= 0 && id <= 99999;
};

const validateUrl = (url) => {
  const re = /^((http|https):)?\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return re.test(url);
};

module.exports = {
  id: validateId
  , url: validateUrl
};
