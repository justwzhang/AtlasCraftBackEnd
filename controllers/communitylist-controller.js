const CommunityList = require("../models/communitylist-model");
const mongo = require("mongodb");

getCommunityLists = async (req, res) => {
	const sort = req.query.sort;
	let sortParam = {};
	sortParam[sort] = -1;
	if (sort === "publishAsc" || sort === "publishDec") {
		sortParam["publishDate"] = sort === "publishAsc" ? 1 : -1;
	}
	const filter = req.query.filter;
	const query = req.query.q;
	console.log(filter);
	console.log(query);
	await CommunityList.aggregate(
		[{ $sort: sortParam }],
		(err, communityLists) => {
			if (err) {
				return res.status(400).json({ success: false, error: err });
			}
			communityLists = communityLists.filter((communityList) => {
				if (filter && query) {
					let value = communityList[filter];
					if (!value) return true;
					value = value.toLowerCase();
					return value === query.toLowerCase();
				}
				return communityList[filter] === query;
			});
			return res
				.status(200)
				.json({ success: true, data: communityLists });
		}
	).catch((err) => console.log(err));
};

createComment = async (req, res) => {
	const body = req.body;
	if (!body) {
		return res.status(400).json({
			success: false,
			error: "You must provide a body to update",
		});
	}

	CommunityList.findOne({ _id: req.params.id }, (err, communityList) => {
		console.log("communityList found: " + JSON.stringify(communityList));
		if (err) {
			return res.status(404).json({
				err,
				message: "Community List List not found!",
			});
		}
		const newComment = {
			_id: new mongo.ObjectId().toString(),
			username: req.username,
			comment: req.body.comment,
		};

		communityList.comments.unshift(newComment);
		communityList
			.save()
			.then(() => {
				console.log("SUCCESS!!!");
				return res.status(200).json({
					success: true,
					id: communityList._id,
					message: "Comment Added",
				});
			})
			.catch((error) => {
				console.log("FAILURE: " + JSON.stringify(error));
				return res.status(404).json({
					error,
					message: "Unable to add comment",
				});
			});
	});
};

updateView = async (req, res) => {
	CommunityList.findOne({ _id: req.params.id }, (err, communityList) => {
		if (err) {
			console.log("List not found");
			return res.status(404).json({
				err,
				message: "Community List List not found!",
			});
		}
		communityList.views = communityList.views + 1;
		communityList
			.save()
			.then(() => {
				console.log("SUCCESS!!!");
				return res.status(200).json({
					success: true,
					id: communityList._id,
					message: "Incremented view",
				});
			})
			.catch((error) => {
				console.log("FAILURE: " + JSON.stringify(error));
				return res.status(404).json({
					error,
					message: "Server Error",
				});
			});
	});
};

updateRating = async (req, res) => {
	CommunityList.findOne({ _id: req.params.id }, (err, communityList) => {
		if (err) {
			return res.status(404).json({
				err,
				message: "Community List List not found!",
			});
		}
		const action = req.body.action;
		const username = req.username;
		switch (action) {
			case "like":
				if (!communityList.likes.includes(username))
					communityList.likes.push(username);
				communityList.dislikes = communityList.dislikes.filter(
					(name) => name !== username
				);
				break;
			case "unlike":
				communityList.likes = communityList.likes.filter(
					(name) => name !== username
				);
				communityList.dislikes = communityList.dislikes.filter(
					(name) => name !== username
				);
				break;
			case "dislike":
				if (!communityList.dislikes.includes(username))
					communityList.dislikes.push(username);
				communityList.likes = communityList.likes.filter(
					(name) => name !== username
				);
				break;
			case "undislike":
				communityList.likes = communityList.likes.filter(
					(name) => name !== username
				);
				communityList.dislikes = communityList.dislikes.filter(
					(name) => name !== username
				);
				break;
		}
		console.log(communityList);
		communityList
			.save()
			.then(() => {
				console.log("SUCCESS!!!");
				return res.status(200).json({
					success: true,
					id: communityList._id,
					message: "Successfully Added Rating",
				});
			})
			.catch((error) => {
				console.log("FAILURE: " + JSON.stringify(error));
				return res.status(404).json({
					error,
					message: "Server Error",
				});
			});
	});
};

module.exports = {
	getCommunityLists,
	createComment,
	updateRating,
	updateView,
};
