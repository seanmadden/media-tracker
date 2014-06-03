/**
 * Created by smmadden on 6/2/14.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MovieSchema = new Schema({
	title: { type: String, required: true },
	watched: { type: Boolean, default: false},
	dateWatched: Date
});

var Movie = mongoose.model('Movie', MovieSchema);