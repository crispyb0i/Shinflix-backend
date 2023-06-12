const mongoose = require("mongoose");
const { Schema, SchemaType, model } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
	username: {
		type: String,
		minLength: 10,
		required: true,
		unique: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

userSchema.plugin(passportLocalMongoose);

const User = model("User", userSchema);
module.exports = User;
