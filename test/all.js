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
        "name": "dummy"
      };
      console.log('current dir' + process.cwd());
      controller.AddCharacter(dummy);
      assert.deepEqual(controller.Characters(), []);
      assert.deepEqual(controller.Character(dummy.name), dummy);
    });
    
  });
});