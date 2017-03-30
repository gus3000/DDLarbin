// Controller
var fs = require('fs')

var charactersPath = './characters/';

exports.Characters = function () {
  dirname = charactersPath;
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
    delete require.cache[require.resolve(charactersPath + name)] // TODO do this when modifying file
    return require(charactersPath + name);
  }
  catch (e) {
    return '';
  }
}

exports.printCharacter = function (name) {
  try {
    char = require(charactersPath + name); // this is genius
    console.log(char);
  } catch (e) {
    console.log('{}')
  }
}
