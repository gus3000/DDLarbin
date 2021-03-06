// Controller
var fs = require('fs-extra');
var path = require('path');
var utils = require('./utils');

var charactersPath = './characters/';
var sheetsPath = './sheets/';

exports.Characters = function () {
  dirname = charactersPath;
  chars = [];
  filenames = fs.readdirSync(dirname);

  filenames.forEach(function (filename) {
    charPath = dirname + filename;
    c = JSON.parse(fs.readFileSync(charPath, 'utf8'));
    chars.push(c);
  })
  return chars;
}

exports.Character = function (name, complete) {

  var charPath = charactersPath + name + '.json';
  //console.log(path.resolve(charPath));
  if (!fs.existsSync(charPath)) {
    //console.log('char '+ name +' doesn\'t exist');
    return null;
  }
  var char = JSON.parse(fs.readFileSync(charPath, 'utf8'));
  if (complete) {
    return exports.CompleteCharacter(char);
  }
  return char;
}

exports.AddCharacter = function (char) {
  name = char.name;
  //console.log('adding char with name '+ name);
  charPath = charactersPath + name + '.json';
  if (fs.existsSync(charPath)) {
    //console.log('char exists');
    throw "Character already exists";
  }
  fs.writeFileSync(charPath, JSON.stringify(char), { encoding: "utf8" });

}

exports.DeleteCharacter = function (name) {
  charPath = charactersPath + name + '.json';
  if (fs.existsSync(charPath)) {
    fs.unlinkSync(charPath);
    return 0;
  }
  return -1;
}

exports.CompleteCharacter = function (char) {

  //default values if needed
  defaultCharPath = charactersPath + 'default_character.json';
  default_char = JSON.parse(fs.readFileSync(defaultCharPath, 'utf8'));//require('./default_character');
  utils.handleDefaultValues(char, default_char);



  //proficiency
  totalLevels = 0;
  classes = Object.keys(char.header.classes);

  classes.forEach(className => {
    totalLevels += char.header.classes[className];
  });
  char.proficiency = Math.floor(((totalLevels) - 1) / 4) + 2;
  char.proficiency = char.proficiency >= 0 ? "+" + char.proficiency : char.proficiency;


  //ability scores
  char.abilityScores = {};

  Object.keys(char.abilities).forEach(a => {
    val = char.abilities[a];
    modVal = Math.floor((val - 10) / 2);
    char.abilityScores[a] = modVal >= 0 ? "+" + modVal : modVal;
  });

  //black dots
  char.proficienciesString = {};
  Object.keys(char.proficiencies).forEach(p => {
    val = char.proficiencies[p];
    if (val) {
      char.proficienciesString[p] = "●";
    }
    else {
      char.proficienciesString[p] = "";
    }
  });

  //saving throws
  char.savingThrows = {};
  Object.keys(char.abilityScores).forEach(a => {
    score = parseInt(char.abilityScores[a]);
    if (char.proficiencies[a]) {
      score += parseInt(char.proficiency);
    }
    char.savingThrows[a] = score >= 0 ? "+" + score : score;
  });

  //skills
  skillsAbilities = require('../skills.json');
  char.skills = {};
  //console.log(skillsAbilities);
  Object.keys(skillsAbilities).forEach(skill => {
    ability = skillsAbilities[skill];
    score = parseInt(char.abilityScores[ability]);
    if (char.proficiencies[skill]) {
      score += parseInt(char.proficiency);
    }
    char.skills[skill] = score >= 0 ? "+" + score : score;
  });

  return char;
}

exports.CharacterSheet = function (name) {
  fullname = sheetsPath + name + '.svg';
  if (!fs.existsSync(fullname)) {
    exports.ComputeSheet(name);
  }
  return fullname;
}

exports.ComputeSheet = function (name, baseSheet) {
  name = name || "dummy";
  baseSheet = baseSheet || "fiche_FR";

  baseSheetName = sheetsPath + baseSheet + '.svg';
  sheetName = sheetsPath + name + '.svg';

  character = exports.Character(name, true);
  dummy = exports.Character('dummy', false);
  //console.log('computing sheet for ' + name + ' : ' + JSON.stringify(character, null, 4));
  aliases = require('../aliases');

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
      // console.log('before : ' + current);
      current = current[fields[i]];
      // console.log('after ' + fields[i] + ': ' + current);
    }
    if (typeof current === 'object') {
      s = "";
      keys = Object.keys(current);
      if (keys.length > 1) {
        //console.log("complex object to print ! This could go wrong.")
      }
      keys.forEach(v => {
        s += v + ": " + current[v] + "\n";
      });
      return s;
    }

    return current;

  });

  fs.writeFileSync(sheetName, svgNewContent);

  //console.log(svgNewContent);

  return sheetName;
}

exports.testLol = function()
{
  console.log('haha !');
}