/**
 * Created by smmadden on 6/2/14.
 */

var express = require("express");
var config = require("./service_config.json");
var Movie = require("./models/movie.js");
var List = require("./models/list.js")
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();
var MovieList;

List.findOne({ title: 'Movies' }).exec(function(err, list) {
    MovieList = list;
});

app.use(bodyParser());

mongoose.connect('mongodb://localhost/' + config.databaseName, function(err) {
    if (err) {
        console.error("Trouble connecting to database. Is mongodb running?")
    }
});

//set headers to allow CORS - this is run before any other routing
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next(); //allow the routing to continue
});

router.route("/movies")
    .get(function(req, res) {
        Movie.find()
            .sort('title')
            .exec(function(err, Movies) {
                if (err) {
                    res.send(err);
                    return;
                }

                res.json(Movies);
            });
    })
    .post(function(req, res) {
        var movie = new Movie();
        movie.parentList = MovieList._id;
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
                res.send(err);
                return;
            }

            if (req.body.title !== undefined)
                movie.title = req.body.title;
            if (req.body.watched !== undefined)
                movie.watched = req.body.watched;
                if (movie.watched === true)
                    movie.watchedDate = new Date();

            movie.save(function(err) {
                if (err) {
                    res.send(err);
                    return;
                }

                res.json("Movie Updated");
            });
        });
    })
	.delete(function(req, res) {
		Movie.findById(req.params.movieId, function(err, movie) {
			if (err) {
				res.send(err);
				return;
			}

			movie.remove();
			res.json("Movie Deleted!");
		})
	});

router.route("/lists")
    .get(function(req, res) {
        List.find()
            .exec(function (err, Lists) {
                if (err) {
                    res.send(err);
                    return;
                }

                res.json(Lists);
            }
        )
    })
    .post(function(req, res) {
        var list = new List();

        list.title= req.body.title;

        list.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }

            res.json(
                {
                    message: 'List Created',
                    list: list
                }
            )
        });
    })

;

router.route("/lists/:listName")
    .get(function(req, res) {
        console.log("GET");
        List.findOne({title: req.params.listName})
            .exec(function(err, list) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.json(list);
            }
        );
    }
);

router.get("/", function(req, res) {
    //TODO: provide a list of valid REST endpoints
    res.json({ message: 'Movie service API' })
});

app.use("/api", router);

app.listen(config.port, function() {
    console.log("Service listening on port", config.port);
});

