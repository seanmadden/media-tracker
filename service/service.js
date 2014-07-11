/**
 * Created by smmadden on 6/2/14.
 */

var express = require("express");
var config = require("./service_config.json");
var ListItem = require("./models/listItem.js");
var List = require("./models/list.js")
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();

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

router.param('list', function(req, res, next, title) {
    List.findOne({ title_lower: title.toLowerCase() }).exec(function(err, list) {
        req.List = list;
        next();
    });
});

//Match the routes from most specific to least specific
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
        list.title_lower = req.body.title.toLowerCase();

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
    });

router.route("/:list")
    .get(function(req, res) {
        ListItem.find({ parentList: req.List._id })
            .sort('title')
            .exec(function(err, ListItems) {
                if (err) {
                    res.send(err);
                    return;
                }

                res.json(ListItems);
            });
    })
    .post(function(req, res) {
        var listItem = new ListItem();
        listItem.parentList = req.List._id;
        listItem.title = req.body.title;
        listItem.title_lower = req.body.title.toLowerCase();

        listItem.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }

            res.json(
                {
                    message: 'ListItem created!',
                    listItem: listItem
                }
            );
        });
    })
    .delete(function(req, res) {
        List.findById(req.List._id, function(err, list) {
            if (err) {
                res.send(err);
                return;
            }

            list.remove();
            res.json("ListItem Deleted!");
        })
    });

router.route("/:list/:listItemId")
    .put(function(req, res) {
        ListItem.findById(req.params.listItemId, function(err, movie) {
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

                res.json("ListItem Updated");
            });
        });
    })
    .delete(function(req, res) {
        ListItem.findById(req.params.movieId, function(err, movie) {
            if (err) {
                res.send(err);
                return;
            }

            movie.remove();
            res.json("ListItem Deleted!");
        })
    });

router.get("/", function(req, res) {
    //TODO: provide a list of valid REST endpoints
    res.json({ message: 'ListItem service API' })
});

app.use("/api", router);

app.listen(config.port, function() {
    console.log("Service listening on port", config.port);
});

module.exports = app;
