const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const Blog = require("./model/Blog");
const User = require("./model/User");

const app = express();
const port = process.env.PORT || 8000;
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(
	session({
		secret: "cat beans are cute.",
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.zaht1.mongodb.net/?retryWrites=true&w=majority`;

// mongoose.set("useCreateIndex", true);
mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

app.get("/", async (req, res) => {
	try {
		const data = await Blog.find();
		console.log(data);
		if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).json({ error: `no blogs found` });
		}
	} catch (error) {
		res.status(500).json(error.body);
	}
});

app.get("/secret", (req, res) => {
	if (req.isAuthenticated) {
		res.status(200).send({
			authenticated: true,
		});
	} else {
		console.log("err", req);
	}
});

app.post("/login", (req, res) => {});

app.post("/register", async (req, res) => {
	const { username, password } = req.body;
	const newUser = new User({ username: username });
	console.log("new user", newUser);
	User.register(newUser, password, (err, user) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		} else {
			passport.authenticate("local")(req, res, () => {
				// redirect to home
				console.log("success", user);
				res.status(201).send();
			});
		}
	});
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
