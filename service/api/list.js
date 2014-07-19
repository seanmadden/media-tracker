/**
 * Created by Sean on 7/19/2014.
 */

var express = require('express'),
    router = express.Router(),
    List = require('../models/list'),
    ListItem = require('../models/listItem'),
    handleError = require('../util').handleError;

//Middleware params
router.param('listItem', function(req, res, next, title) {
    ListItem.findOne({ title_lower: title.toLowerCase(), parentList: req.List._id }).exec(function(err, listItem) {
        req.ListItem = listItem;
        next();
    });
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

//Routing
//Match the routes from most specific to least specific
router.route("/lists")
    .get(function(req, res) {
        List.find(function (err, Lists) {
                if (err) return handleError(err);

                res.json({
                    status: "SUCCESS",
                    lists: Lists,
                    count: Lists.length
                });
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

                res.json({
                    status: 'SUCCESS',
                    listItems: ListItems,
                    count: ListItems.length
                });
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

module.exports = router;