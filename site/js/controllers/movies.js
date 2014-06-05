/**
 * Created by smmadden on 6/4/14.
 */

angular.module('movieResources', ['ngResource'])
	.factory('Movie', ['$resource',
		function($resource) {
			return $resource('http://localhost:3030/api/movies', {}, {
				query: { method: 'GET', isArray: true }
			});
	}]);