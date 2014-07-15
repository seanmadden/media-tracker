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
    ListItem.remove({ parent_id: this._id }).exec();
    next();
});

//var ListItem = mongoose.model('ListItem', MovieSchema);
module.exports = mongoose.model('List', ListSchema);