angular.module('starter.controllers', [])
    .controller('DashCtrl', function (FoodMenuHolder) {
        FoodMenuHolder.update();
    })

    .controller('ChatsCtrl', function ($scope, DataboomService) {

    })

    .controller('ChatDetailCtrl', function($scope, $stateParams, $ionicPopup) {
        $scope.showConfirm = function() {
            var confirmTable = $ionicPopup.confirm({
                title: "Подтвердите выбор",
                template: "Вы точно хотите этот столик?"
            });
            confirmTable.then(function(res) {
                if (res) {
                    console.log("You are sure");
                } else {
                    console.log("You are not sure");
                }
            });
        };
    })

    .controller('MenuCtrl', function($scope, FoodMenuHolder) {
        $scope.menuTypes = FoodMenuHolder.getMenuType();
    })
    
    .controller('MenuDetailCtrl', function ($scope, FoodMenuHolder, $stateParams) {
        var allMenu = FoodMenuHolder.getMenu().filter(function(item) {
            return item.Owner === $stateParams.menuTypeId;
        });

        if (FoodMenuHolder.getMenuType().some(function(item) {
                return (item.id === $stateParams.menuTypeId);
        }))
        {
            
        } else {
            
        }
    })
    .controller('SubMenuDetailCtrl', function ($scope, FoodMenuHolder, $stateParams) {
        
    })

        .controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })

    .controller('NewsCtrl', function($http, $scope) {
        $http.get('http://igorapi.esy.es/dwpbar/newsfeed.php', {})
            .success(function(data) {

                $scope.newsList = data.response.items.sort(function(a, b) {
                    return a.date > b.date;
                });

                for (var i = 0; i < $scope.newsList.length; ++i) {
                    $scope.newsList[i].date = new Date($scope.newsList[i].date * 1000);
                }
                console.log($scope.newsList);
            })
            .error(function(error) {
                console.log('error');
            });

    });
