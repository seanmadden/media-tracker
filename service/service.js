/**
 * Created by smmadden on 6/2/14.
 */

var express = require("express");
var config = require("./service_config.json");
var ListItem = require("./models/listItem.js");
var List = require("./models/list.js")
var User = require("./models/user.js")
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var userRouter = require('./api/user');
var listRouter = require('./api/list');
var oauthserver = require('node-oauth2-server');
var app = express();
var router = express.Router();

app.use(bodyParser());

mongoose.connect('mongodb://localhost/' + config.databaseName, function(err) {
    if (err) {
        console.error("Trouble connecting to database. Is mongodb running?");
    }
});

//set headers to allow CORS - this is run before any other routing
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next(); //allow the routing to continue
});

router.get("/", function(req, res) {
    //TODO: provide a list of valid REST endpoints
    res.json({ message: 'ListItem service API' })
});

app.oauth = oauthserver({
    model: User,
    grants: ['password', 'refresh_token'],
    debug: true
});

//Remember to route from most specific to least specific!
app.use("/api", app.oauth.authorise(), function(req, res) {
    res.send('oauth works');
});
app.use("/api", router);
app.use("/api", userRouter);
app.use("/api", listRouter);

//TODO: SSL
app.listen(config.port, function() {
    console.log("Service listening on port", config.port);
});



module.exports = app;
