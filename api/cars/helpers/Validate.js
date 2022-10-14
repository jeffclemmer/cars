/* 
some simple validation for our API
*/

module.exports = {
  /* 
  options.len = maxlen
  options.message = message to return
  */
  string: (s, options) => {
    let len = 64;
    let message = "string";

    if (options !== undefined) {
      if ("len" in options) len = options.len;
      if ("message" in options) message = options.message;
    }
    if (s === undefined) throw `${message} is undefined`;
    if (s === "") throw `${message} is empty`;
    if (s.length > len) throw `${message} is too long`;
  },
};
