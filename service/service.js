/**
 * Created by smmadden on 6/2/14.
 */

var express = require("express"),
	config = require("./service_config.json"),
	Movie = require("./models/movie.js"),
	app = express();

app.listen(config.port, function() {
	console.log("Service listening on port", config.port);
});

app.get("/", function(req, res) {
	//TODO: provide a list of valid REST endpoints
	res.send("listeners...");
});

app.get("event", function (req, res) {
	console.log("handling some event here");
});
