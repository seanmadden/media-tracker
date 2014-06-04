/**
 * Created by smmadden on 6/2/14.
 */

var express = require("express"),
	config = require("./service_config.json"),
	Movie = require("./models/movie.js"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	app = express(),
	router = express.Router();

app.use(bodyParser());

mongoose.connect('mongodb://localhost/test');

router.use(function(req, res, next) {
	console.log("Incoming request");
	next(); //allow the routing to continue
});

router.route("/movies")
	.get(function(req, res) {
		Movie.find(function(err, Movies) {
			if (err) {
				res.send(err);
				return;
			}

			res.json(Movies);
		});
	})
	.post(function(req, res) {
		var movie = new Movie();
		movie.title = req.body.title;

		movie.save(function(err) {
			if (err) {
				res.send(err);
				return;
			}

			res.json(
				{
					message: 'Movie created!',
					movie: movie
				}
			);
		});
	});

router.get("/", function(req, res) {
	//TODO: provide a list of valid REST endpoints
	res.json({ message: 'Movie service API' })
});

app.use("/api", router);

app.listen(config.port, function() {
	console.log("Service listening on port", config.port);
});

