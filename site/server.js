/**
 * Created by smmadden on 6/2/14.
 */

var express = require("express"),
	config = require("./site_config.json"),
	app = express();

app.listen(config.port, function() {
	console.log("Site listening on port", config.port);
});

app.get("/", function(req, res) {
	res.send("testing");
});
