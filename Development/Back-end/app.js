var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config.js');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

/* connect to database */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/coles');
require('./models/Photo');

var routes = require('./routes/index');
var search = require('./routes/search');

//test
var product = require('./models/product.js');

var assets = require('./routes/assets');
var users = require('./routes/users');

var assets_public = require('./routes/assets_public');
var users_public = require('./routes/users_public');

//update
var update = require('./routes/update');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');



app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.set('view engine', 'pug');
var engines = require('consolidate');
app.engine('pug', engines.pug);
app.engine('html', engines.ejs);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 1200000 }, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//test
app.use(express.static('./public'));
app.use('/avatar', express.static('./avatar'));

var authenticated = function (req, res, next) {
	if (req.isAuthenticated() && req.user) {
		console.log('loged in with: ' + req.user.email);
		next();
	} else {
		res.redirect('/users_public/login');
	}
};

app.use('/', routes);
app.use('/price', search);

app.use('/users', authenticated, users);
app.use('/assets', authenticated, assets);

app.use('/users_public', users_public);
app.use('/assets_public', assets_public);

//update
app.use('/update', routes);

app.post(
	'/login',
	passport.authenticate('local', {
		failureRedirect: '/loginFailure',
		successRedirect: '/index2' //跳转到商家搜索 添加商品。。。
	})
);

app.get('/loginFailure', function (req, res, next) {
	res.send('Failed to authenticate');
});

// app.get('/loginSuccess', function(req, res, next) {
//   res.send('Successfully authenticated');
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('pages/error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

mongoClient.connect(config.MONGO_CONNECTION, function (err, db) {
	if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
	else {
		console.log('Connected to mongoDB');
		app.set('db', db);

		passport.use(
			new LocalStrategy(function (username, password, done) {
				process.nextTick(function () {
					var usersCollection = db.collection('users');

					usersCollection.findOne(
						{
							email: username
						},
						function (err, user) {
							if (err) {
								return done(err);
							}

							if (!user) {
								return done(null, false);
							}

							if (user.password != password) {
								return done(null, false);
							}

							return done(null, user);
						}
					);
				});
			})
		);

		passport.serializeUser(function (user, done) {
			done(null, user);
		});

		passport.deserializeUser(function (user, done) {
			done(null, user);
		});
	}
});

app.listen(config.PORT, function () {
	console.log('Listening to port: ' + config.PORT);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('pages/error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
