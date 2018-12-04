// var express = require('express');
// var router = express.Router();
// var mongoose = require('mongoose');
// var product = mongoose.model('products');
// var mongodb = require('mongodb');
// var ObjectId = require('mongodb').ObjectId;

// router.get('/update', function (req, res, next) {
// 	value = req.query.newprice;
// 	id = req.query.idofproduct;

// 	var db = app.get('db');

// 	db.collection('products').update(
// 		{ "_id": ObjectId(id) },
// 		{ "$set": { "price2": value } },
// 		//{ "$push": { "sellerList": { "name": "shopping", "price": value } } },
// 		{ upsert: true },
// 		function (err, result) {
// 			if (err) throw err;
// 			console.log('aaa');
// 		}
// 	);
// 	//res.render('search');
// });

// module.exports = router;
