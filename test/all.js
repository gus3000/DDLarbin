var assert = require('assert');
var fs = require('fs-extra');
var os = require('os');
var path = require('path');
var utils = require('../utils');

var controller = require('../controller');

var oldDir;
var tmpDir = path.join(os.tmpdir(), 'ddlarbin');

before(function () {
  oldDir = process.cwd()
  fs.mkdirpSync(tmpDir);
  process.chdir(tmpDir);
  fs.mkdirpSync('characters');
  fs.mkdirpSync('sheets');
  fs.copySync(oldDir +'/sheets/fiche_FR.svg', 'sheets/fiche_FR.svg');
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
        assert.ok(utils.includedRecursively(dummy, controller.Character(dummy.name, true)));
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
        assert.notDeepEqual(controller.Character(voiran, true), voiran);
        assert.ok(utils.includedRecursively(voiran, controller.Character(voiran.name, true)));

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
          "inspiration": false,
          "proficiency": "+4",
          "abilityScores": {
            "strength": "+0",
            "dexterity": "+4",
            "constitution": "+1",
            "intelligence": "+5",
            "wisdom": "+2",
            "charisma": "+0"
          },
          "savingThrows": {
            "strength": "+0",
            "dexterity": "+4",
            "constitution": "+1",
            "intelligence": "+9",
            "wisdom": "+6",
            "charisma": "+0"
          },
          "skills": {
            "acrobatics": "+4",
            "animalHandling": "+2",
            "arcana": "+9",
            "athletics": "+0",
            "deception": "+0",
            "history": "+9",
            "insight": "+2",
            "intimidation": "+0",
            "investigation": "+5",
            "medicine": "+6",
            "nature": "+5",
            "perception": "+2",
            "performance": "+0",
            "persuasion": "+0",
            "religion": "+5",
            "sleightOfHand": "+4",
            "stealth": "+8",
            "survival": "+2"
          },
          "proficienciesString": {
            "strength": "",
            "dexterity": "",
            "constitution": "",
            "intelligence": "●",
            "wisdom": "●",
            "charisma": "",
            "acrobatics": "",
            "animalHandling": "",
            "arcana": "●",
            "athletics": "",
            "deception": "",
            "history": "●",
            "insight": "",
            "intimidation": "",
            "investigation": "",
            "medicine": "●",
            "nature": "",
            "perception": "",
            "performance": "",
            "persuasion": "",
            "religion": "",
            "sleightOfHand": "",
            "stealth": "●",
            "survival": ""
          }

        };
        controller.AddCharacter(melmor);

        assert.deepEqual(controller.Character(melmor.name), melmor);
        //console.log(JSON.stringify(controller.Character(melmor.name, true), null, '  '));
        assert.deepEqual(controller.Character(melmor.name, true), melmor);
      });

      it('adding existing character', function () {
        dummy = {
          "name": "dummySimple"
        };
        assert.deepEqual(controller.Character(dummy.name), dummy);
        assert.throws(function () { controller.AddCharacter(dummy); }, 'Character already exists');
      });
    });

    describe('Sheet creation', function () {
      it('creates simple sheet', function () {
        if (!controller.Character("dummySimple")) {
          this.skip();
        }
        controller.ComputeSheet("dummySimple");
        assert.ok(fs.existsSync("./sheets/dummySimple.svg"));
      })
    });

    describe('Deleting characters', function () {
      it('deleting added character', function () {
        if (!controller.Character("dummySimple")) {
          this.skip();
        }
        controller.DeleteCharacter("dummySimple");
        assert.deepEqual(controller.Character("dummySimpledd"), null);
      });
      it('deleting all characters', function () {
        controller.Characters().forEach(function(element) {
          controller.DeleteCharacter(element.name);
        }, this);
        assert.deepEqual(controller.Characters(), []);
      });
    });



  });
});