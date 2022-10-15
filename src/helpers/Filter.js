// returns a string that is xss filtered
export function xss(s) {
  return s.replace(/[<]/g, "\x3C");
}

// returns a string that is filtered of everything except lowercase letters
export function onlyLowercase(s) {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}
