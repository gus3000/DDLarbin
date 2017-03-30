// Controller
var fs = require('fs')


exports.Characters = function () {
  dirname = './characters/';
  chars = [];
  filenames = fs.readdirSync(dirname);

  filenames.forEach(function (filename) {
    c = require(dirname + filename);
    chars.push(c);
  })
  return chars;
}

exports.Character = function (name) {
  try {
    return require('./characters/' + name);
  }
  catch (e) {
    return '';
  }
}

exports.printCharacter = function (name) {
  try {
    char = require("./characters/" + name); // this is genius
    console.log(char);
  } catch (e) {
    console.log('{}')
  }
}
