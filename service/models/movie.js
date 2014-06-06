/**
 * Created by smmadden on 6/2/14.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MovieSchema = new Schema({
	title: { type: String, required: true },
	watched: { type: Boolean, default: false},
	watchedDate: Date
});

//var Movie = mongoose.model('Movie', MovieSchema);
module.exports = mongoose.model('Movie', MovieSchema);