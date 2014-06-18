/**
 * Created by smmadden on 6/4/14.
 */

angular.module('movieResources', ['ngResource'])
    .factory('Movie', ['$resource',
        function($resource) {
            return $resource('http://localhost:3030/api/movies/:movieId', {}, {
                query: { method: 'GET', isArray: true },
                add: { method: 'POST' },
                update: { method: 'PUT', params: {movieId: '@movieId'}},
                delete: { method: 'DELETE', params: {movieId: '@movieId'}}
            });
    }]);