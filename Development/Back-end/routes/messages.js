
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('Got to messages page...');
});

router.post('/send', function(req, res, next) {
    var db = app.get("db");
    var messagesCollection = db.collection("messages");

    if (req.body.msg && req.user.email == req.body.msg.fromUser) {
        req.body.msg.sendDate = new Date;

        messagesCollection.insert(req.body.msg, function (err, result) {
            if (err)
                console.log("Could not save message to db");

            return res.json(err);
        });
    } else {
        res.send("Message info is missing");
    }
});

module.exports = router;