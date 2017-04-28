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
        console.log('dummy : '+ JSON.stringify(dummy));
        console.log('dummy in base : '+ JSON.stringify(controller.Character(dummy.name)));

        assert.deepEqual(controller.Character(dummy.name), dummy);
      });

      it.skip('adding complex character', function () {

      });

      it('adding existing character', function () {
        dummy = {
          "name": "dummySimple"
        };
        assert.deepEqual(controller.Character(dummy.name), dummy);
        assert.throws(function() { controller.AddCharacter(dummy);}, 'Character already exists');
      });
    });



    describe('Deleting characters', function () {
      it('deleting added character', function () {
        if (!controller.Character("dummy")) {
          this.skip();
        }
        controller.DeleteCharacter("dummy");
        assert.deepEqual(controller.Character("dummy"), null);
      });
    });
  });
});