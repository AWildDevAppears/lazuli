var lazuli  = require("lazuli.js");

new (lazuli.query("row"))
  .where({
    "x": {equals: "a"},
    "y": {notEqual: "6"}
  })
  .arrange("asc")
  .find()
  .then(function (res) {
    console.log(res);
  }, function (err) {
    console.log(err);
  });


var x = new lazuli.Object("row");


x.write({x: "y"});
