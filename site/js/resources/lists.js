/**
 * Created by Sean on 7/5/2014.
 */

angular.module('listResources', ['ngResource'])
    .factory('List', ['$resource',
        function($resource) {
            return $resource('http://localhost:3030/api/Lists/:movieId', {}, {
                query: { method: 'GET', isArray: true },
                add: { method: 'POST' },
                update: { method: 'PUT', params: {movieId: '@movieId'}},
                delete: { method: 'DELETE', params: {movieId: '@movieId'}}
            });
        }]);