/**
 * Created by smmadden on 6/2/14.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListItemSchema = new Schema({
    title: { type: String, required: true },
    title_lower: { type: String, required: true },
    complete : { type: Boolean, default: false},
    completedDate : Date,
    parentList : { type: String, required: true },
    creator: { type: String, required: true },
    order : Number
});

//var ListItem = mongoose.model('ListItem', MovieSchema);
module.exports = mongoose.model('ListItem', ListItemSchema);