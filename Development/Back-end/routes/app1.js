var express = require('express');
var app = express();
var product = require('/Users/mac/Downloads/Web-Mobile/models/product.js')


app.set('view engine', 'ejs');
app.use(express.static('../public'));
app.use("/avatar", express.static('./avatar'));


app.get('/', function (req, res, next) {
	res.render('index1.ejs');
});


// 用于搜索框
app.get('/search1', function (req, res, next) {
	name = req.query.key;
	// name 除了用于搜索数据库也得传进去用于 关键字标红  
	condition = "^" + name;
	product.find({ "name": { $regex: condition, $options: "$i" } }, function (err, result) {
		if (result.length > 9) {
			res.json(result.slice(0, 10));
		} else {
			res.json(result);
		}
	});
});

app.get('/search', function (req, res, next) {
	name = trimStr(req.query.key);
	if (name.length == 0) {
		res.render('search1',
			{
				"result": "",
				"keywords": ""
			});
	} else {
		name1 = name.split(' ');

		var condition = '';
		for (var i = 0; i < name1.length; i++) {
			condition += "(" + name1[i] + ").*";
		}
		product.find({ "name": { $regex: condition, $options: "$i" } }, null, { sort: { price1: 1 } }, function (err, result) {
			res.render('search1',
				{
					"result": result,
					"keywords": name
				});
		});
	}
});

router.post('/update', function (req, res, next) {
	res.render('search1');
});




function trimStr(str) { return str.replace(/(^\s*)|(\s*$)/g, ""); }

//app.listen(3000);