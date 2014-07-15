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

router.param('list', function (req, res, next, title) {
    List.findOne({ title_lower: title.toLowerCase() }, function (err, list) {
        req.List = list;
        if (list == null) {
            res.json({
                    status: 'FAILED',
                    message: 'List not found'
                }
            );
            return;
        }
        next();
    });
});

//Match the routes from most specific to least specific
router.route("/lists")
    .get(function(req, res) {
        List.find(function (err, Lists) {
                if (err) return handleError(err);

                res.json(Lists);
            }
        )
    })
    .post(function(req, res) {
        List.findOne({title_lower: req.body.title.toLowerCase()}, function(err, list) {
            //check to see if the list exists
            if (list != null) {
                res.json({status: 'FAILED',
                    message: "List Already Exists!"});
            } else {
                //create the list
                var list = new List();
                list.title= req.body.title;
                list.title_lower = req.body.title.toLowerCase();

                list.save(function(err) {
                    if (err) return handleError(err);

                    res.json(
                        {
                            status: "SUCCESS",
                            message: 'List Created',
                            list: list
                        }
                    )
                });
            }
        });
    });

router.route("/:list")
    .get(function(req, res) {
        ListItem.find({ parentList: req.List._id })
            .sort('title')
            .exec(function(err, ListItems) {
                if (err) return handleError(err);

                res.json(ListItems);
            });
    })
    .post(function(req, res) {
        var listItem = new ListItem();
        listItem.parentList = req.List._id;
        listItem.title = req.body.title;
        listItem.title_lower = req.body.title.toLowerCase();

        listItem.save(function(err) {
            if (err) return handleError(err);

            res.json(
                {
                    message: 'ListItem created!',
                    listItem: listItem
                }
            );
        });
    })
    .delete(function(req, res) {
        //TODO: add error handling
        req.List.remove(function(err) {
            if (err) return handleError(err);
        });
        res.json(
            {
                status: "SUCCESS",
                message: "List Deleted!"
            });
    });


router.param('listItem', function(req, res, next, title) {
    ListItem.findOne({ title_lower: title.toLowerCase(), parentList: req.List._id }).exec(function(err, listItem) {
        req.ListItem = listItem;
        next();
    });
});

router.route("/:list/:listItem")
    .put(function(req, res) {
        ListItem.findById(req.params.listItemId, function(err, movie) {
            if (err) return handleError(err);


            if (req.body.title !== undefined)
                movie.title = req.body.title;
            if (req.body.watched !== undefined)
                movie.watched = req.body.watched;
            if (movie.watched === true)
                movie.watchedDate = new Date();

            movie.save(function(err) {
                if (err) return handleError(err);

                res.json("ListItem Updated");
            });
        });
    })
    .delete(function(req, res) {
        ListItem.remove({_id: req.ListItem._id}, function(err) {
            if (err) return handleError(err);
        });
        res.json(
            {
                status: "SUCCESS",
                message: "ListItem Deleted!"
            });
    });

router.get("/", function(req, res) {
    //TODO: provide a list of valid REST endpoints
    res.json({ message: 'ListItem service API' })
});

app.use("/api", router);

app.listen(config.port, function() {
    console.log("Service listening on port", config.port);
});

function handleError(err) {
    //TODO: logging
    res.send(err);
}

module.exports = app;
