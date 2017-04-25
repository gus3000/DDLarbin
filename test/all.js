var assert = require('assert');
var fs = require('fs-extra');
var controller = require('../controller');

var oldDir;
var tmpDir = '/tmp/ddlarbin/';

before(function () {
  oldDir = process.cwd()
  fs.mkdirpSync(tmpDir);
  process.chdir(tmpDir);
  fs.mkdirSync('characters');
  fs.mkdirSync('sheets');
});

after(function () {
  fs.removeSync(tmpDir);
  console.log('old directory : ' + oldDir);
  process.chdir(oldDir);
});

describe('Controller', function () {
  describe('#Characters', function () {
    it('without characters', function () {
      assert.deepEqual(controller.Characters(), []);
    });
    it('adding character', function () {
      dummy = {
        "name": "dummy",
        "header": {
          "classes": {},
          "background": "",
          "playerName": "nobody",
          "race": "",
          "alignment": "",
          "xp": 0
        },
        "abilities": {
          "strength": 0,
          "dexterity": 0,
          "constitution": 0,
          "intelligence": 0,
          "wisdom": 0,
          "charisma": 0
        },
        "inspiration": false
      };
      controller.AddCharacter(dummy);
      assert.deepEqual(controller.Characters(), []);
      assert.deepEqual(controller.Character(dummy.name), dummy);
    });
  });
});