var express = require('express');
var router = express.Router();

// router.get('/', function(req, res, next) {
//     var db = app.get("db");
//     var assetsCollection = db.collection("assets");

//     assetsCollection
//         .find(req.query)
//         .toArray(function(err, data) {
//           if (err) {
//             res.send(err);
//           } else {
//             console.log(JSON.stringify(data));
//             res.send(data);
//           }
//         });
// });
var product = require('/Users/mac/Downloads/Web-Mobile/models/product.js');

router.get('/', function (req, res, next) {
	res.render('index1.ejs');
});

// 用于搜索框
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
	productName = trimStr(req.query.key);
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

function trimStr(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}

//app.listen(3000);

/*
router.get('/', function(req, res, next) {
  try {
    var filter = JSON.parse(req.query.filter || {});
    searchWithFilter(res, filter);
  } catch (e) {
    responseString = {
      message : 'unparsable filter. filter must be a json string',
      error : e
    }
    res.send(responseString);
  }
});

function searchWithFilter(res, filter) {
    var db = app.get("db");
    var assetsCollection = db.collection("assets");

    assetsCollection
      .find(filter)
      .toArray(function(err, data) {
        if (err) {
          res.send(err);
        } else {
          console.log(JSON.stringify(data));
          res.send(data);
        }

      });
}
*/
module.exports = router;
