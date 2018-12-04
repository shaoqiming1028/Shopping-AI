
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;

router.get('/userAssets', function(req, res) {
    var db = app.get("db");
    var assetsCollection = db.collection("assets");

    var user = req.session.passport.user;
    var ownedAssetsObjectIds = user.ownedAssets.map(ObjectId);

    assetsCollection.find({
        _id : { $in : ownedAssetsObjectIds }
    }).toArray(function (err, data) {

            if (err) {
                res.json(err);
            }

            console.log(data.length + " results were found");
            console.log(JSON.stringify(data));
            
            res.json(data);
        });
});

router.post('/add', function(req, res) {

    var db = app.get("db");
    var assetsCollection = db.collection("assets");
    var usersCollection = db.collection("users");

    var user = req.session.passport.user;

    var assetToInsert = req.body;
    assetToInsert.dateCreated = new Date();
    assetToInsert.listingOwner =  { _id : user._id, email : user.email };
    
    assetsCollection.insert(
        assetToInsert, 
        function(err, result) {
            if (err) {
                console.log("Could not save asset to db");
                res.json(err);
            } else {
                    usersCollection.update(
                        { _id : ObjectId(user._id)},
                        { 
                            $addToSet: {
                                ownedAssets : result.insertedIds[0]
                            }
                        },
                        function(err, result) {
                            if (err) {
                                console.log("Could not save asset to db");
                                res.json(err);
                            } else {
                                res.json({success : true});
                            }
                        }                    
                    )
            }
    });


});

router.delete('/remove/:id', function(req, res) {

    var db = app.get("db");
    var assetsCollection = db.collection("assets");
    var usersCollection = db.collection("users");

    var user = req.session.passport.user;

    var id = req.params.id;
    assetsCollection.remove(
        { "_id" : mongodb.ObjectId(id)},
        function(err, result) {
            if (err) {
                console.log("Could not remove asset with id " + id );
                return res.json({success : false, message : err});
            } else if (result.result.n == 0){
                res.send({success : false, message : "asset with id " + id + " not found" });
            } else {
                usersCollection.update(
                        { _id : ObjectId(user._id)},
                        { 
                            $pull: { ownedAssets : ObjectId(id) } 
                        },
                        function(err, result) {
                            if (err) {
                                console.log("Could not save asset to db");
                                res.json(err);
                            } else {
                                res.json({success : true});
                            }
                        }                    
                    )
            }
    });
});

module.exports = router;