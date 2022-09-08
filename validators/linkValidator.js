const linkRegex = /^https?:\/\/(www.)?[a-z0-9.-]{2,}\.[a-z]{2,}\/?[-._~:/?#[\]@!$&'()*+,;=\w]*#?$/;

module.exports = function linkValidator(link) {
  const regex = new RegExp(linkRegex);
  return regex.test(link);
};

module.exports = linkRegex;
