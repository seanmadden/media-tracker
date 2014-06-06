/**
 * Created by smmadden on 6/2/14.
 */

var express = require("express");
var	config = require("./service_config.json");
var	Movie = require("./models/movie.js");
var mongoose = require("mongoose");
var	bodyParser = require("body-parser");
var	app = express();
var	router = express.Router();

app.use(bodyParser());

mongoose.connect('mongodb://localhost/test');

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
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

router.route("/movies/:movieId")
	.put(function(req, res) {
		Movie.findById(req.params.movieId, function(err, movie) {
			if (err) {
				req.send(err);
				return;
			}

			if (req.body.title)
				movie.title = req.body.title;
			if (req.body.watched)
				movie.watched = req.body.watched;
				if (movie.watched === true)
					movie.watchedDate = new Date();

			movie.save(function(err) {
				if (err)
					res.send(err);

				res.json("Movie Updated");
			});
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

