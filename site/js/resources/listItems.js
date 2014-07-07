/**
 * Created by smmadden on 6/4/14.
 */

angular.module('listItemResources', ['ngResource'])
    .factory('ListItem', ['$resource',
        function($resource) {
            return $resource('http://localhost:3030/api/:listName/:listItemId', {}, {
                query: { method: 'GET', isArray: true, params: { listName: '@listName' } },
                add: { method: 'POST', params: { listName: '@listName' } },
                update: { method: 'PUT', params: { listName: '@listName', movieId: '@movieId'}},
                delete: { method: 'DELETE', params: { listName: '@listName', movieId: '@movieId'}}
            });
    }]);