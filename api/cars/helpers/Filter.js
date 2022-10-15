module.exports = {
  // do xss filtering on a string
  xss: (s) => s.replace(/[<]/g, "\x3C"),

  // returns a string that is filtered of everything except lowercase letters
  onlyLowercase: (s) => s.toLowerCase().replace(/[^a-z]/g, ""),
};
