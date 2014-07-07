/**
 * Created by smmadden on 6/3/14.
 */

var movies = express.Router();

movies.route("/movies")
	.post(function(req, res) {
		var movie = new ListItem();
		movie.title = req.body.title;

		movie.save(function(err) {
			if (err) {
				res.send(err);
				return;
			}

			res.json(
				{
					message: 'ListItem created!',
					movie: movie
				}
			);
		});
	});