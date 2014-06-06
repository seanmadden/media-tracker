/**
 * Created by smmadden on 6/4/14.
 */

angular.module('mediaTracker', ['ngRoute', 'movieResources'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/',
				{
					templateUrl: 'default.html'
				}
			).when('/movies',
				{
					controller: 'movieController',
					templateUrl: 'movies.html'
				}
			)
		}
	]
)
	.controller('movieController', function movieController($scope, Movie) {
		$scope.movies = Movie.query();

		$scope.addMovie = function() {
			console.log("movieTitle is", $scope.movieTitle);
			Movie.add({ title: $scope.movieTitle });
		};

		$scope.updateMovie = function(movieId, watched) {
			console.log("Updating movie:", movieId);
			Movie.update({ movieId: movieId, watched: watched });
		};
	}
);