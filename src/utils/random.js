function int (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function string (length) {
  const seed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var string = '';
  for (var i = 0; i < length; i++) {
    string = string + seed[int(0, seed.length)];
  }
  return string;
}

module.exports = {
  string,
  int
};
