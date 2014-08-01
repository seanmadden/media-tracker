/**
 * Created by Sean on 7/19/2014.
 */

var express = require('express'),
    router = express.Router(),
    List = require('../models/list'),
    ListItem = require('../models/listItem'),
    utils = require('../util');

//Middleware params
router.param('listItem', function(req, res, next, title) {
    ListItem.findOne({ title_lower: title.toLowerCase(), parentList: req.List._id }).exec(function(err, listItem) {
        req.ListItem = listItem;
        next();
    });
});

router.param('list', function (req, res, next, title) {
    List.findOne({ title_lower: title.toLowerCase(), creator: req.oauth.userId }, function (err, list) {
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
        List.find({ creator: req.oauth.bearerToken.userId }, function (err, Lists) {
                if (err) return utils.handleError(err, res);

                res.json({
                    status: "SUCCESS",
                    lists: Lists,
                    count: Lists.length
                });
            }
        )
    })
    .post(function(req, res) {
        var validation = utils.requiredFieldValidator(req.body, ['title']);
        if (!validation.isValid) {
            return res.json({
                status: 'FAILED',
                message: validation.message
            });
        }

        List.findOne({title_lower: req.body.title.toLowerCase(), creator: req.oauth.bearerToken.userId }, function(err, list) {
            //check to see if the list exists
            if (list != null) {
                return res.json({status: 'FAILED',
                    message: "List Already Exists!"});
            } else {
                //create the list
                var list = new List();
                list.title= req.body.title;
                list.title_lower = req.body.title.toLowerCase();
                list.creator = req.oauth.bearerToken.userId;

                list.save(function(err) {
                    if (err) return utils.handleError(err, res);

                    return res.json(
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
                if (err) return utils.handleError(err, res);

                res.json({
                    status: 'SUCCESS',
                    listItems: ListItems,
                    count: ListItems.length
                });
            });
    })
    .post(function(req, res) {
        var validation = utils.requiredFieldValidator(req.body, ['title']);
        if (!validation.isValid) {
            res.json({
                status: 'FAILED',
                message: validation.message
            });
        }

        var listItem = new ListItem();
        listItem.parentList = req.List._id;
        listItem.title = req.body.title;
        listItem.title_lower = req.body.title.toLowerCase();

        listItem.save(function(err) {
            if (err) return utils.handleError(err, res);

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
            if (err) return utils.handleError(err, res);
        });
        res.json(
            {
                status: "SUCCESS",
                message: "List Deleted!"
            });
    });

router.route("/:list/:listItem")
    .put(function(req, res) {
        ListItem.findById(req.params.listItemId, function(err, listItem) {
            if (err) return utils.handleError(err, res);

            if (req.body.title !== undefined)
                listItem.title = req.body.title;
            if (req.body.complete !== undefined)
                listItem.complete = req.body.complete;
            if (listItem.complete === true)
                listItem.completedDate = new Date();

            listItem.save(function(err) {
                if (err) return utils.handleError(err, res);

                res.json("ListItem Updated");
            });
        });
    })
    .delete(function(req, res) {
        ListItem.remove({_id: req.ListItem._id}, function(err) {
            if (err) return utils.handleError(err, res);
        });
        res.json(
            {
                status: "SUCCESS",
                message: "ListItem Deleted!"
            });
    });

module.exports = router;