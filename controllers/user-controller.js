const auth = require("../auth");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const { response } = require("express");

getLoggedIn = async (req, res) => {
	auth.verify(req, res, async function () {
		try {
			const loggedInUser = await User.findOne({ _id: req.userId });
			console.log(loggedInUser);
			return res.status(200).json({
				loggedIn: true,
				user: {
					firstName: loggedInUser.firstName,
					lastName: loggedInUser.lastName,
					email: loggedInUser.email,
					username: loggedInUser.username,
				},
			});
		} catch (err) {
			console.log(err);
			return res.status(400).send();
		}
	});
};

registerUser = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			email,
			password,
			passwordVerify,
			username,
		} = req.body;
		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!passwordVerify ||
			!username
		) {
			return res
				.status(400)
				.json({ errorMessage: "Please enter all required fields." });
		}
		if (password.length < 8) {
			return res.status(400).json({
				errorMessage:
					"Please enter a password of at least 8 characters.",
			});
		}
		if (password !== passwordVerify) {
			return res.status(400).json({
				errorMessage: "Please enter the same password twice.",
			});
		}
		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				errorMessage:
					"An account with this email address already exists.",
			});
		}

		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
			firstName,
			lastName,
			username,
			email,
			passwordHash,
		});
		const savedUser = await newUser.save();

		// LOGIN THE USER
		// const token = auth.signToken(savedUser);

		await res
			// .cookie("token", token, {
			// 	httpOnly: true,
			// 	secure: true,
			// 	sameSite: "none",
			// })
			.status(200)
			.json({
				success: true,
				user: {
					firstName: savedUser.firstName,
					lastName: savedUser.lastName,
					email: savedUser.email,
					username: savedUser.username,
				},
			})
			.send();
	} catch (err) {
		console.error(err);
		res.status(500).send();
	}
};

loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res
				.status(400)
				.json({ errorMessage: "Please enter all required fields." });
		}
		// Try to find User
		const user = await User.findOne({ username });
		if (!user) {
			return res
				.status(400)
				.json({ errorMessage: "Invalid Credentials" });
		}
		// Compare password hashes
		const match = await bcrypt.compare(password, user.passwordHash);
		// Auth Failed
		if (!match) {
			return res
				.status(400)
				.json({ errorMessage: "Invalid Credentials" });
		} else {
			const token = auth.signToken(user);
			await res
				.cookie("token", token, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
				})
				.status(200)
				.json({
					success: true,
					user: {
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email,
						username: user.username,
					},
				})
				.send();
		}
	} catch (err) {
		console.log(err);
		res.status(500).send();
	}
};

logoutUser = async (req, res) => {
	return res.clearCookie("token").status(200).json({
		success: true,
		message: "Successfully Logged out",
	});
};
module.exports = {
	getLoggedIn,
	registerUser,
	loginUser,
	logoutUser,
};
