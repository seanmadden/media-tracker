/**
 * Created by Sean on 7/19/2014.
 */

var express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    utils = require('../util');

router.route('/user')
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json({
                message: 'SUCCESS',
                users: users
            });
        });
    })
    .post(function(req, res) {
        var user = new User();

        var validation = utils.requiredFieldValidator(req.body, ['email', 'password']);
        if (!validation.isValid) {
            res.json({
                status: 'FAILED',
                message: validation.message
            })
        }

        User.findOne({ email_lower: req.body.email.toLowerCase() }, function(err, user) {
            if (user !== null) {
                res.json({
                    status: 'FAILED',
                    message: 'User already exists'
                });
            } else {
                user.email = req.body.email;
                user.email_lower = req.body.email.toLowerCase();
                user.password = req.body.password;
                user.save(function(err, user) {
                    if (err)
                        return utils.handleError(err, res);

                    res.json({
                        status: 'SUCCESS',
                        message: user.email + ' has been successfully created'
                    })
                });
            }
        });
    });


module.exports = router;