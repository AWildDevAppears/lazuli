var lazuli  = require("lazuli.js");

new (lazuli.query("table"))   // Y
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


var x = new lazuli.Object("row");  // Y
x.write({x: "y"});                 // N



laz = new Lazuli()
x = new laz.Object()

x.write({"author_id": 3339, "technology": "paper", "description": "hello", "code": "foo"})
