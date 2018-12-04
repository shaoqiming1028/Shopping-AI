var viewUtils = {};

viewUtils.getBaseViewScope = function(req) {
	var userEmail = '';
	if (req.session.passport) {
		userEmail = req.session.passport.user.email;
	}

	return { username: userEmail };
};

module.exports = viewUtils;
