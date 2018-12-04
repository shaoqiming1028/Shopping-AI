
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

router.get('/', function(req, res, next) {
    res.send('Got to assets public page...');
});

router.get('/all', function(req, res) {
    var db = app.get("db");
    var assetsCollection = db.collection("assets");

    assetsCollection.find({}).toArray(function(err, data) {
        console.log(JSON.stringify(data));
        res.json(data);
    });
});

router.get('/within/box/:upperRight/:bottomLeft', function(req, res) {
    var upperRightCoords = req.params.upperRight.split(',').map(parseFloat);
    var bottomLeftCoords = req.params.bottomLeft.split(',').map(parseFloat);

    var db = app.get("db");
    var assetsCollection = db.collection("assets");

    var filter = {};

    filter.geoLocation = {
                $geoWithin: {
                    $box: [
                        bottomLeftCoords,
                        upperRightCoords
                    ]
                }
            };

    var listingType = req.query.listingType;
    if (listingType && listingType != "") {
        filter.listingType = listingType;
    }

    assetsCollection.find(
        filter,
        {
            'geoLocation' : 1,
            'listingType' : 1,
            'type' : 1,
            'address' : 1,
            'price' : 1,
            'priceCurrency' : 1,
            'numOfRooms' : 1
        }).toArray(function(err, data) {
            if (err) {
                console.log(err);
            }
            console.log(JSON.stringify(data));
            res.json(data);
        });
});

module.exports = router;