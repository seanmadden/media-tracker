/**
 * Created by smmadden on 6/2/14.
 */

var express = require("express"),
	config = require("./site_config.json"),
	app = express(),
	router = express.Router();

//router.route("/")
//	.get(function (req, res) {
//	}
//);

app.use("/", express.static(__dirname + "/layout"));
app.use("/js", express.static(__dirname + "/js"));

app.listen(config.port, function() {
	console.log("Site listening on port", config.port);
});

//app.get("/", router);
