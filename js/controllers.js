angular.module('starter.controllers', [])
    .controller('DashCtrl', function (FoodMenuHolder) {
        FoodMenuHolder.update();
    })

    .controller('ChatsCtrl', function ($scope, DataboomService, $ionicPopup) {
        var allTables;
        $scope.showCapacity = function(table) {
            return table.Capacity !== 0 ? "Вместимость: "+ table.Capacity : null;
        }
        DataboomService.load("Table").then(function(data) {
            allTables = data;
            $scope.tables = allTables.filter(function (item) {
                return (item.Parent === "00000000-0000-0000-0000-000000000000") && (!item.Busy);
            });
            $scope.nextMenu = function(table) {
                if (table.IsFolder) {
                    var menu = allTables.filter(function(item) {
                        return (item.Parent === table.id) && (!item.Busy);
                    });
                    $scope.parent = table;
                    $scope.tables = menu;
                    $scope.showPrevButton = $scope.parent !== "00000000-0000-0000-0000-000000000000";
                } else {
                    var showConfirm = function () {
                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Подтвердите заказ',
                            template: 'Вы действительно хотите этот столик?'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                //////////////////
                            } else {
                                ///////////////////
                            }
                        });
                    };
                    showConfirm();
                    console.log("Зашел!");

                }
            }
            $scope.prevMenu = function () {
                var prevMenu;
                if ($scope.parent.Parent === "00000000-0000-0000-0000-000000000000") {
                    prevMenu = allTables.filter(function (item) {
                        return (item.Parent === "00000000-0000-0000-0000-000000000000") && (!item.Busy);
                    });
                    $scope.parent = null;
                } else {
                    prevMenu = allTables.filter(function (item) {
                        return (item.Parent === $scope.parent.Parent) && (!item.Busy);
                    });
                    var parentMenu = allTables.filter(function (item) {
                        return item.id === prevMenu[0].Parent;
                    });
                    $scope.parent = parentMenu[0];
                }
                $scope.tables = prevMenu;
                $scope.showPrevButton = $scope.parent !== null;
            }
        });
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

    .controller('SubMenuCtrl', function ($scope, FoodMenuHolder, $stateParams) {

        $scope.menu = FoodMenuHolder.getMenu().filter(function(item) {
            return (item.Parent === "00000000-0000-0000-0000-000000000000") && (item.Owner === $stateParams.menuTypeId);
        });

        $scope.nextMenu = function (element) {
            if (element.IsFolder) {
                var menu = FoodMenuHolder.getMenu().filter(function (item) {
                    return item.Parent === element.id;
                });
                $scope.parent = element;
                $scope.menu = menu;
                $scope.showPrevButton = $scope.parent !== "00000000-0000-0000-0000-000000000000";
            }
        }

        $scope.showPrice = function(element) {
            return element.Price !== 0 ? "Цена: "+element.Price : null;
        }

        $scope.prevMenu = function() {
            var prevMenu;
            if ($scope.parent.Parent === "00000000-0000-0000-0000-000000000000") {
                prevMenu = FoodMenuHolder.getMenu().filter(function(item) {
                    return (item.Parent === "00000000-0000-0000-0000-000000000000") && (item.Owner === $stateParams.menuTypeId);
                });
                $scope.parent = null;
            } else {
                prevMenu = FoodMenuHolder.getMenu().filter(function(item) {
                    return item.Parent === $scope.parent.Parent;
                });
                var parentMenu = FoodMenuHolder.getMenu().filter(function(item) {
                    return item.id === prevMenu[0].Parent;
                });
                $scope.parent = parentMenu[0];
            }           
            $scope.menu = prevMenu;
            $scope.showPrevButton = $scope.parent !== null;
        }

        $scope.showPrevButton = false;
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
