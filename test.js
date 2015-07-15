var lazuli  = require("lazuli.js");

new (lazuli.query("row"))   // Y
  .where({                  // Y
    "x": {equals: "a"},     // Y
    "y": {notEqual: "6"}    // N
  })
  .arrange("asc")           // N
  .find()                   // Y
  .then(function (res) {    // Y
    console.log(res);
  }, function (err) {
    console.log(err);
  });


var x = new lazuli.Object("row");  // N
x.write({x: "y"});                 // N
