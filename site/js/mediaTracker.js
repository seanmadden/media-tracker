/**
 * Created by smmadden on 6/4/14.
 */

angular.module('mediaTracker', ['ngRoute', 'listItemResources', 'listResources'])
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/',
                {
                    controller: 'manageController',
                    templateUrl: 'default.html'
                }
            ).when('/:listName',
                {
                    controller: 'listController',
                    templateUrl: 'list.html'
                }
            )
        }
    ]
)
    .controller('listController', function listController($scope, $routeParams, ListItem) {
        $scope.listName = $routeParams.listName;
        $scope.isSaving = false;
        $scope.isNullTitleError = false;
        $scope.listItems = ListItem.query({listName: $scope.listName });
		console.log($scope.listItems);

        $scope.addListItem = function() {
            if (typeof $scope.listItemTitle === "undefined" ||
                       $scope.listItemTitle === null ||
                       $scope.listItemTitle === "") {
                $scope.isNullTitleError = true;
                return;
            }

            $scope.isSaving = true;
            ListItem.add({ listName: $scope.listName, title: $scope.listItemTitle }, function(data) {
	            console.log(data);
                $scope.isSaving = false;
	            if (typeof data.listItem !== "undefined")
					$scope.listItems.push(data.listItem);
            });
            $scope.listItemTitle = "";
        };

        $scope.updateMovie = function(movieId, watched) {
            console.log("Updating movie:", movieId);
            ListItem.update({ listName: $scope.listName, movieId: movieId, watched: watched });
        };

        $scope.deleteMovie = function(movie) {
            ListItem.delete({ listName: $scope.listName, movieId: movie._id });
            $.each($scope.listItems, function(key, value) {
                if (value._id == movie._id) {
                    $scope.listItems.splice($scope.listItems.indexOf(movie), 1);
                }
            });
        }
    })
    .controller('manageController', function manageController($scope, List) {
        $scope.isSaving = false;
        $scope.isNullTitleError = false;
        $scope.lists = List.query();
        console.log($scope.lists);

        $scope.addList = function() {
            if (typeof $scope.listTitle === "undefined" ||
                $scope.listTitle === null ||
                $scope.listTitle === "") {
                $scope.isNullTitleError = true;
                return;
            }

            $scope.isSaving = true;
                List.add({ title: $scope.listTitle }, function(data) {
                    console.log(data);
                    $scope.isSaving = false;
                    if (typeof data.movie !== "undefined")
                        $scope.lists.push(data.list);
                });
            $scope.listTitle = "";
        }
    })
;