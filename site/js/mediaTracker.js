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
        $scope.isSaving = false;
        $scope.isNullTitleError = false;
        $scope.movies = Movie.query();
		console.log($scope.movies);

        $scope.addMovie = function() {
            if (typeof $scope.movieTitle === "undefined" ||
                       $scope.movieTitle === null ||
                       $scope.movieTitle === "") {
                $scope.isNullTitleError = true;
                return;
            }

            $scope.isSaving = true;
            Movie.add({ title: $scope.movieTitle }, function(data) {
	            console.log(data);
                $scope.isSaving = false;
	            if (typeof data.movie !== "undefined")
					$scope.movies.push(data.movie);
            });
            $scope.movieTitle = "";
        };

        $scope.updateMovie = function(movieId, watched) {
            console.log("Updating movie:", movieId);
            Movie.update({ movieId: movieId, watched: watched });
        };

        $scope.deleteMovie = function(index) {
            movieToDelete = $scope.movies[index];
            Movie.delete({ movieId: movieToDelete._id });
            $.each($scope.movies, function(key, value) {
                if (value._id == movieToDelete._id) {
                    $scope.movies.splice(index, 1);
                }
            });
        }
    }
);