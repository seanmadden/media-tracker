/**
 * Created by smmadden on 6/4/14.
 */

angular.module('mediaTracker', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/',
				{
					templateUrl: 'index.html'
				}
			).when('/movies',
				{
					controller: 'movieController',
					templateUrl: 'movies.html'
				}
			)
		}
	]
);