/**
 * Created by smmadden on 6/2/14.
 */

var express = require("express"),
	app = express();

app.listen(3000);

app.get("/", function(req, res) {
	res.send("testing");
});
