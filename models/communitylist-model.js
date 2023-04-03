const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommunityListSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		items: {
			type: [Object],
			required: true,
		},
		likes: {
			type: [String],
			required: true,
		},
		dislikes: {
			type: [String],
			required: true,
		},
		views: {
			type: Number,
			required: true,
		},
		comments: {
			type: [Object],
			required: true,
		},
		publishDate: {
			type: Date,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("CommunityList", CommunityListSchema);
