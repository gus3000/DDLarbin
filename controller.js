// Controller
var fs = require('fs')

var charactersPath = './characters/';
var sheetsPath = './sheets/';

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

exports.Character = function (name, complete) {
  try {
    delete require.cache[require.resolve(charactersPath + name)] // TODO do this when modifying file
    if (complete) {
      return exports.CompleteCharacter(require(charactersPath + name));
    }
    return require(charactersPath + name);
  }
  catch (e) {
    return '';
  }
}

exports.CompleteCharacter = function (char) {
  char.abilityScores = {};
  Object.keys(char.abilities).forEach(a => {
    val = char.abilities[a];
    modVal = Math.floor((val - 10) / 2);
    char.abilityScores[a] = modVal >= 0 ? "+" + modVal : modVal;
  })
  return char;
}

exports.printCharacter = function (name) {
  try {
    char = require(charactersPath + name); // this is genius
    console.log(char);
  } catch (e) {
    console.log('{}');
  }
}

exports.ComputeSheet = function (name, baseSheet) {
  name = name || "dummy";
  baseSheet = baseSheet || "fiche_FR";

  baseSheetName = sheetsPath + baseSheet + '.svg';
  sheetName = sheetsPath + name + '.svg';

  character = exports.Character(name, true);
  aliases = require('./aliases');

  svgContent = fs.readFileSync(baseSheetName).toString();
  svgNewContent = svgContent.replace(/\$\$(.*)\$\$/g, (match, fieldName, offset, string) => {
    //console.log('found ' + fieldName + 'from '+ name);
    fields = fieldName.split('.');
    current = character;
    for (var i = 0; i < fields.length; i++) {
      potentialAlias = aliases[fields[i]];
      if (potentialAlias) {
        fields[i] = potentialAlias;
      }
      // console.log('before : '+ current);
      current = current[fields[i]];
      // console.log('after '+ fields[i] +': '+ current);
    }
    if (typeof current === 'object') {
      s = "";
      keys = Object.keys(current);
      if(keys.length > 1)
      {
        console.log("complex object to print ! This could go wrong.")
      }
      keys.forEach(v => {
        s += v + ": "+ current[v] + "\n";
      });
      return s;
    }

    return current;
  });

  fs.writeFileSync(sheetName, svgNewContent);

  //console.log(svgNewContent);

  return sheetName;
}