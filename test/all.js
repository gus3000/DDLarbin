var assert = require('assert');
var fs = require('fs-extra');
var os = require('os');
var path = require('path');

var controller = require('../controller');

var oldDir;
var tmpDir = path.join(os.tmpdir(), 'ddlarbin');

before(function () {
  oldDir = process.cwd()
  fs.mkdirpSync(tmpDir);
  process.chdir(tmpDir);
  fs.mkdirpSync('characters');
  fs.mkdirpSync('sheets');
});

after(function () {
  fs.removeSync(tmpDir);
  process.chdir(oldDir);
});

describe('Controller', function () {
  describe('#Characters', function () {
    describe('Getting characters', function () {
      it('without characters', function () {
        assert.deepEqual(controller.Characters(), []);
      });
    });
    describe('Adding characters', function () {
      it('adding simple character', function () {
        dummy = {
          "name": "dummySimple"
        };

        assert.deepEqual(controller.Characters(), []);
        controller.AddCharacter(dummy);

        assert.deepEqual(controller.Character(dummy.name), dummy);
      });

      it('adding complex character', function () {
        voiran = {
          "name": "Voïran",
          "header": {
            "classes": {
              "cleric": 4
            },
            "background": " ",
            "playerName": "Antoine",
            "race": "Mountain Dwarf",
            "alignment": "LG",
            "xp": 0
          },
          "abilities": {
            "strength": 20,
            "dexterity": 12,
            "constitution": 15,
            "intelligence": 8,
            "wisdom": 16,
            "charisma": 8
          }
        };
        controller.AddCharacter(voiran);
        assert.deepEqual(controller.Character(voiran.name), voiran);
        assert.notDeepEqual(controller.Character(voiran,true), voiran);

      });

      it('adding complete character', function () {
        melmor = {
          "name": "Melmor",
          "header": {
            "classes": {
              "wizard": 9
            },
            "background": "Technomancer",
            "playerName": "gus3000",
            "race": "Forest Gnome",
            "alignment": "LG",
            "xp": 0
          },
          "abilities": {
            "strength": 10,
            "dexterity": 18,
            "constitution": 13,
            "intelligence": 20,
            "wisdom": 15,
            "charisma": 11
          },
          "proficiencies": {
            "strength": false,
            "dexterity": false,
            "constitution": false,
            "intelligence": true,
            "wisdom": true,
            "charisma": false,

            "acrobatics": false,
            "animalHandling": false,
            "arcana": true,
            "athletics": false,
            "deception": false,
            "history": true,
            "insight": false,
            "intimidation": false,
            "investigation": false,
            "medicine": true,
            "nature": false,
            "perception": false,
            "performance": false,
            "persuasion": false,
            "religion": false,
            "sleightOfHand": false,
            "stealth": true,
            "survival": false
          },
          "inspiration": false
        };
        controller.AddCharacter(melmor);

        assert.deepEqual(controller.Character(melmor.name), melmor);
      });

      it('adding existing character', function () {
        dummy = {
          "name": "dummySimple"
        };
        assert.deepEqual(controller.Character(dummy.name), dummy);
        assert.throws(function () { controller.AddCharacter(dummy); }, 'Character already exists');
      });
    });



    describe('Deleting characters', function () {
      it('deleting added character', function () {
        if (!controller.Character("dummySimple")) {
          this.skip();
        }
        controller.DeleteCharacter("dummySimple");
        assert.deepEqual(controller.Character("dummySimpledd"), null);
      });
    });
  });
});