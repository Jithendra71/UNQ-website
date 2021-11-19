var express = require("express");
var app = express();

var formidable = require("express-formidable");
app.use(formidable());

var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;

var http = require("http").createServer(app);

app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");


var mainURL = "http://localhost:3000";


http.listen(3000, function () {

	console.log("Server started at " + mainURL);
	mongoClient.connect("mongodb://localhost:27017", function (error, client) {
		var database = client.db("my_social_network");
		console.log("Database connected. " + database);

		app.get("/signup", function (request, result) {
			result.render("signup");
		});

		app.get("/login", function (request, result) {
			result.render("login");
		});

	});
});