
var express = require('express');
var router = express.Router();
var viewUtils = require('../views/viewUtils.js');

router.get('/', function(req, res, next) {
    res.send('Got to assets public page...');
});

router.get('/login', function(req, res, next) {
    var viewScope = viewUtils.getBaseViewScope(req);
    console.log(req.body)
    res.render('pages/login', viewScope);
});

router.post('/signup', function(req, res, next) {
    var db = app.get("db");
    var usersCollection = db.collection("users");

    var user = req.body;
    //console.log(user);

    if (validateSignupData(user)) {

        user.dateCreated = new Date();

        usersCollection.insert(req.body, function (err, result) {
            if (err) {
                console.log("Could not save user to db");
                return res.json({ 'success' : false, 'err' : err});
            }
            
            return res.json({ 'success' : true });
        });
    } else {
        res.send("User info is missing or invalid");
    }
});

function validateSignupData(user) {
    return (user.email && user.password);
}

router.get('/all', function(req, res) {
    var db = app.get("db");
    var usersCollection = db.collection("users");

    usersCollection.find({}).toArray(function(err, data) {
        console.log(JSON.stringify(data));
        res.json(data);
    });
});

module.exports = router;