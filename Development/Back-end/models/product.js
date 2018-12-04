var mongoose = require('mongoose');
// 引用数据库 ！！！！！！
var db = require('./db.js');
var productschema = new mongoose.Schema({
	image: String,
	productName: String,
	productsInfo: String,
	sellerList: [
		{
			name: String,
			location: String,
			price: Number
			// },
			// {
			// 	name: String,
			// 	location: String,
			// 	price: String
			// },
			// {
			// 	name: String,
			// 	location: String,
			// 	price: String
		}
	]
});

productschema.index({ "productName": 1 });

var productmodel = db.model('products', productschema);
module.exports = productmodel;