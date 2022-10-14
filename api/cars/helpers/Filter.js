module.exports = {
  // do xss filtering on a string
  xss: (s) => s.replace(/[\<]/g, "&lt;"),
};
