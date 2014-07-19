/**
 * Created by Sean on 7/19/2014.
 */

var express = require('express'),
    router = express.Router(),
    User = require('../models/user');


router.route('/user')
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });


module.exports = router;