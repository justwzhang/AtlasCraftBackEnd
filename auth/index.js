const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

function authManager() {
	verify = async function (req, res, next) {
		try {
			const token = req.cookies.token;
			if (!token) {
				return res.status(401).json({
					loggedIn: false,
					user: null,
					errorMessage: "Unauthorized",
				});
			}

			const verified = jwt.verify(token, process.env.JWT_SECRET);
			req.userId = verified.userId;
			try {
				const user = await User.findById(req.userId);
				req.username = user.username;
			} catch (err) {
				return res
					.status(401)
					.json({ success: false, error: "Unauthorized" });
			}

			next();
		} catch (err) {
			console.error(err);
			return res.status(401).json({
				errorMessage: "Unauthorized",
			});
		}
	};

	signToken = function (user) {
		return jwt.sign(
			{
				userId: user._id,
			},
			process.env.JWT_SECRET
		);
	};
	return this;
}

const auth = authManager();
module.exports = auth;
