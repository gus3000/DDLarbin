

exports.printCharacter = function(name)
{
  char = require("./characters/"+ name); //this is genius
  console.log(char);
}
