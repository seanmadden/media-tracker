/**
 * Created by Sean on 7/5/2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListSchema = new Schema({
    title: { type: String, required: true },
    createDate: Date
});

//var Movie = mongoose.model('Movie', MovieSchema);
module.exports = mongoose.model('List', ListSchema);