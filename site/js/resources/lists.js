/**
 * Created by Sean on 7/5/2014.
 */

angular.module('listResources', ['ngResource'])
    .factory('List', ['$resource',
        function($resource) {
            return $resource('http://localhost:3030/api/Lists/:listName', {}, {
                query: { method: 'GET', isArray: true },
                add: { method: 'POST' },
                find: { method: 'GET', params: { listName: '@listName' }},
                update: { method: 'PUT', params: {movieId: '@movieId'}},
                delete: { method: 'DELETE', params: {movieId: '@movieId'}}
            });
        }]);