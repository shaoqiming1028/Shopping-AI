/**
 * Run with the command: $ node initDB.js
 */
var child_process = require('child_process');
var config = require('../config.js');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

mongoClient.connect(config.MONGO_CONNECTION, function(err, db) {
  if (err)
    console.log('Unable to connect to the mongoDB server. Error:', err);
  else {
      console.log('Connected to mongoDB');
      initializeDB(db);
  }
});

function initializeDB(db) {
    var assets = db.collection("assets");
    var users = db.collection("users");
    assets.createIndex( { "geoLocation" : "2dsphere" } );
    users.createIndex( { "email": 1 }, { unique: true } );

    mongoImport("housefinder", "assets", "assets.json");
    mongoImport("housefinder", "users", "users.json");
    db.close();
}

function mongoImport(db_name, collection, filepath) {
    child_process.execFile(
        "mongoimport",["-d", db_name,"-c", collection, "--file", filepath ], 
        function(err, data) {
            if (err) {
                console.log(err);
            }
        });
}