/**
 * Created by Sean on 7/5/2014.
 */
var mongoose = require('mongoose'),
    ListItem = require("./listItem.js"),
    Schema = mongoose.Schema;

var ListSchema = new Schema({
    title: { type: String, required: true },
    title_lower: { type: String, required: true },
    createDate: Date
});

ListSchema.pre('remove', function(next) {
    ListItem.remove({ parentList: this._id }, function(err) {
        if (err) {
            console.log(err);
        }
    });
    next();
});

//var ListItem = mongoose.model('ListItem', MovieSchema);
module.exports = mongoose.model('List', ListSchema);