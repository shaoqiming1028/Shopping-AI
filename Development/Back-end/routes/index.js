var express = require('express');
var router = express.Router();
var viewutils = require('../views/viewUtils.js');
var product = require('../models/product.js');

var upload = require('./upload');
var mongoose = require('mongoose');
var Photo = mongoose.model('Photos');

var exec = require('child_process').exec;

//var mongoclient = require('mongodb').mongoclient;
//var url = 'mongodb://localhost:27017/';
var Mongoclient = require('mongodb').MongoClient;

var ObjectId = require('mongodb').ObjectId;

/* get home page. */
router.get('/', function (req, res, next) {
	var viewscope = viewutils.getBaseViewScope(req);
	res.render('pages/index', viewscope);
});

/* get map */
router.get('/map', function (req, res, next) {
	var viewscope = viewutils.getBaseViewScope(req);
	viewscope.query = req.query;
	res.render('pages/map', viewscope);
});

router.get('/price', function (req, res, next) {
	var viewscope = viewutils.getBaseViewScope(req);
	viewscope.query = req.query;
	res.render('pages/index1', viewscope);
});

//upload image page
router.get('/index2', function (req, res, next) {
	Photo.find({}, ['path', 'caption'], { sort: { _id: -1 } }, function (err, photos) {
		res.render('pages/index2.pug', { title: 'upload images', msg: req.query.msg, photolist: photos });
		//console.log(req.headers.cookie);
		//console.log(req.session.passport.user.email); // success
	});
});

router.get('/update', function (req, res, next) {
	value = req.query.newprice;
	id = req.query.idofproduct;

	Mongoclient.connect('mongodb://localhost:27017/coles_4_Sep', function (err, connection) {
		if (err) throw err;
		var collection = connection.collection('products');

		collection.update(
			{ "_id": ObjectId(id) },
			{ "$set": { "sellerList.1": { "name": "Coles", "location": "rundle mall", "price": value } } },
			{ upsert: true },
			function (err, result) {
				//console.log(result);
				res.render('search1', {
					result: result,
					keywords: name
				});
				connection.close();
			}
		);
	});

	// db.collection('products').update(
	// 	{ "_id": ObjectId(id) },
	// 	{ "$set": { "sellerList.1": { "name": "Coles", "location": "rundle mall", "price": value } } },
	// 	{ upsert: true },
	// 	function (err, result) {
	// 		console.log(result);
	// 		res.render('search1', {
	// 			result: result,
	// 			keywords: name
	// 		});
	// 	}
	// );

});

// Hard update
// db.getCollection('products').update(
// 	{ "_id" : ObjectId("5b7d263ee9d2fd3e779f8d82") },
// 	{ "$set": { "sellerList.1": { "name": "Coles", "location": "rundle mall","price": 4.5 } } },
//         { upsert: true }
// );

router.post('/mobile_upload', function (req, res, next) {
	upload(req, res, (error) => {
		if (error) {
			res.redirect('/?msg=3');
		} else {
			if (req.file == undefined) {
				res.redirect('/?msg=2');
			} else {
				/**
			   * create new record in mongodb
			   */
				var fullpath = 'files/' + req.file.filename;

				var document = {
					path: fullpath,
					caption: req.body.caption
				};

				var photo = new Photo(document);
				photo.save(function (error) {
					if (error) {
						throw error;
					}

					//res.redirect('/price');  // 模型识别，返回到 predict_lable;

					//model mitigation
					var printstring = '';
					var arg1 = '/users/mac/downloads/web-mobile/public/' + document.path;
					var filename = 'resnet_eval.py';
					exec('python3' + ' ' + filename + ' ' + arg1, function (err, stdout, stderr) {
						if (err) {
							console.log('stderr', err);
						}
						if (stdout) {
							//console.log(stdout);
							printstring = printstring + stdout;
							// console.log(printstring);
						}
						// 去掉转义字符
						printstring = printstring.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
						// 去掉特殊字符
						//printstring = printstring.replace(/[\@\#\$\%\^\&\*\(\)\{\}\:\"\l\<\>\?\[\]]/);

						//console.log(printstring);
						//console.log(req.session.passport.user.email); success
						name = '' + printstring;
						console.log(printstring);

						// name = trimstr(req.query.key);
						if (name.length == 0) {
							res.render('search1', {
								result: '',
								keywords: ''
							});
						} else {
							// name =
							// 	"bellamy's organic peach & apple 120g on special,nestle cerelac muesli with pear 8m + 200g ,nestle cerelac oats with prune 6m + 200g ";
							name1 = name.split(',');

							// var condition = '';
							// for(var i = 0; i < name1.length;i++){
							// condition +="(" + name1[i] + ").*";
							// }

							Mongoclient.connect('mongodb://localhost:27017/coles_4_Sep', function (err, connection) {
								if (err) throw err;
								var collection = connection.collection('products');
								collection.find({
									$or: [
										{ productName: name1[0] },
										{ productName: name1[1] },
										{ productName: name1[2] }
									]
								})
									.toArray(function (err, result) {
										// 返回集合中所有数据
										if (err) throw err;
										console.log(JSON.stringify(result));
										res.send(JSON.stringify(result));
										connection.close();
									});
							});

							// db.find({$or: [ { productname: name1[0]}, { productname: name1[1]},{ productname: name1[2]} ]},null,function(err,result){
							// 	console.log(result);
							// 	//console.log(json.stringify(result));
							// 	//res.send(json.stringify(result));
							// 	res.render('search1',
							// 		{"result":result,
							// 		"keywords":name
							// 		});

							// 	});
						}
					});
				});
			}
		}
	});
});

router.post('/upload', function (req, res, next) {
	//image.open(sys.argv[1])
	upload(req, res, (error) => {
		if (error) {
			callback(error);
		} else {
			if (req.file == undefined) {
				callback(undefined);
			} else {
				var fullpath = 'files/' + req.file.filename;

				var document = {
					path: fullpath,
					caption: req.body.caption
				};

				var photo = new Photo(document);
				photo.save(function (error) {
					if (error) {
						throw error;
					}
					//res.redirect('/price');  // 模型识别，返回到 predict_lable;

					//model mitigation
					var printstring = '';
					var arg1 = '/users/mac/downloads/web-mobile/public/' + document.path;
					var filename = 'fine_tune.py';
					exec('python3' + ' ' + filename + ' ' + arg1, function (err, stdout, stderr) {
						if (err) {
							console.log('stderr', err);
						}
						if (stdout) {
							//console.log(stdout);
							printstring = printstring + stdout;
							// console.log(printstring);
						}
						// 去掉转义字符
						printstring = printstring.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
						// 去掉特殊字符
						printstring = printstring.replace(/[\@\#\$\%\^\&\*\(\)\{\}\:\"\l\<\>\?\[\]]/);

						console.log(printstring);
						//console.log(req.session.passport.user.email); success
						name = '' + printstring;

						// name = trimstr(req.query.key);
						if (name.length == 0) {
							res.render('search1', {
								result: '',
								keywords: ''
							});
						} else {
							name1 = name.split(' ');

							var condition = '';
							for (var i = 0; i < name1.length; i++) {
								condition += '(' + name1[i] + ').*';
							}
							product.find(
								{ productName: { $regex: condition, $options: '$i' } },
								null,
								function (err, result) {
									//console.log(json.stringify(result));
									res.render('search1', {
										result: result,
										keywords: name
									});
								}
							);
						}
					});
				});
			}
		}
	});
});

router.get('/search1', function (req, res, next) {
	productName = req.query.key;
	// name 除了用于搜索数据库也得传进去用于 关键字标红
	condition = '^' + productName;
	product.find({ productName: { $regex: condition, $options: '$i' } }, function (err, result) {
		if (result.length > 9) {
			res.json(result.slice(0, 10));
		} else {
			res.json(result);
		}
	});
});

router.get('/search', function (req, res, next) {
	productName = trimstr(req.query.key);
	if (productName.length == 0) {
		res.render('search1', {
			result: '',
			keywords: ''
		});
	} else {
		name1 = productName.split(' ');

		var condition = '';
		for (var i = 0; i < name1.length; i++) {
			condition += '(' + name1[i] + ').*';
		}
		product.find({ productName: { $regex: condition, $options: '$i' } }, null, function (
			err,
			result
		) {
			res.render('search1', {
				result: result,
				keywords: productName
			});
		});
	}
});

function trimstr(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}

function getassetsfromdb(filter, callback) {
	var db = app.get('db');
	var assetscollection = db.collection('assets');

	assetscollection.find({}).toarray(function (err, data) {
		console.log(json.stringify(data));
		callback(data);
	});
}

module.exports = router;
