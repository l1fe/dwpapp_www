﻿angular.module('starter.controllers', [])
    .controller('DashCtrl', function(FoodMenuHolder) {
        FoodMenuHolder.update();
    })

    .controller('ChatsCtrl', function($scope, TableMenuHolder, $ionicPopup, OrderHolder, $state) {
        var nullLink = "00000000-0000-0000-0000-000000000000";
        var tables;
        TableMenuHolder.update().then(function(data) {
            tables = data;
            $scope.tables = tables.filter(function(item) {
                return (item.Parent === nullLink) && (!item.Busy);
            });
        });

        function nextMenu(element) {
            var menu = tables.filter(function(item) {
                return (item.Parent === element.id) && (!item.Busy);
            });
            $scope.parent = element;
            $scope.tables = menu;
            $scope.showBackButton = $scope.parent !== nullLink;
        }

        function toOrder(element) {
            OrderHolder.initOrder();
            var title = "Подтвердите заказ";
            var template = "Вы действительно хотите забронировать этот столик?";

            function showConfirm() {
                var confirmPopup = $ionicPopup.confirm({
                    title: title,
                    template: template
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        OrderHolder.setTable(element.id);
                        OrderHolder.setOrderStatus(true);
                        $state.go("tab.menu");
                    } else {
                        console.log("User taped cancel in tables order.");
                    }
                });
            }

            showConfirm();
        }

        $scope.textCapacity = function(table) {
            return table.Capacity !== 0 ? "Вместимость: " + table.Capacity : null;
        }

        $scope.clickElement = function(element) {
            if (element.IsFolder) {
                nextMenu(element);
            } else {
                toOrder(element);
            }
        }

        $scope.prevMenu = function() {
            var prevMenu;
            if ($scope.parent.Parent === nullLink) {
                prevMenu = tables.filter(function(item) {
                    return (item.Parent === nullLink) && (!item.Busy);
                });
                $scope.parent = null;
            } else {
                prevMenu = tables.filter(function(item) {
                    return (item.Parent === $scope.parent.Parent) && (!item.Busy);
                });
                var parentMenu = tables.filter(function(item) {
                    return item.id === prevMenu[0].Parent;
                });
                $scope.parent = parentMenu[0];
            }
            $scope.tables = prevMenu;
            $scope.showBackButton = $scope.parent !== null;
        }
    })

    .controller('MenuCtrl', function($scope, FoodMenuHolder, OrderHolder, $ionicPopup, $state) {
        $scope.showOrderButton = OrderHolder.getOrderStatus();
        $scope.menuTypes = FoodMenuHolder.getMenuType();
        $scope.orderReady = function() {
            var title = "Заказ:";
            var template = "";
            var menu = OrderHolder.getMenu();
            for (var i = 0; i < menu.length; i++) {
                template += menu[i].Numenclature + "[" + menu[i].Quantity + "]\n";
            }

            function showInfo() {
                var popup = $ionicPopup.alert({
                    title: title,
                    template: template
                });
                popup.then(function(res) {
                    console.log('Thank you for not eating my delicious ice cream cone');
                });
            }
            OrderHolder.sentOrder();
            showInfo();
            $state.go("tab.dash");
        }
    })

    .controller('SubMenuCtrl', function($scope, FoodMenuHolder, $stateParams, OrderHolder, $ionicPopup, $state) {
        var nullLink = "00000000-0000-0000-0000-000000000000";

        $scope.showOrderButton = OrderHolder.getOrderStatus();
        $scope.showBackButton = false;
        $scope.menu = FoodMenuHolder.getMenu().filter(function(item) {
            return (item.Parent === nullLink) && (item.Owner === $stateParams.menuTypeId);
        });

        $scope.orderReady = function() {
            var title = "Заказ:";
            var template = "";
            var menu = OrderHolder.getMenu();
            for (var i = 0; i < menu.length; i++) {
                template += menu[i].Numenclature + "[" + menu[i].Quantity + "]\n";
            }

            function showInfo() {
                var popup = $ionicPopup.alert({
                    title: title,
                    template: template
                });
                popup.then(function(res) {
                    console.log('Thank you for not eating my delicious ice cream cone');
                });
            }

            OrderHolder.sentOrder();
            showInfo();
            $state.go("tab.dash");
        }

        $scope.tapElement = function(element) {
            var title = "Подтвердите выбор";
            var template = "Добавить это к заказу?";

            function showConfirm() {
                var confirmPopup = $ionicPopup.confirm({
                    title: title,
                    template: template
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        OrderHolder.addToMenu(element);
                    } else {
                        console.log("User taped cancel in order.");
                    }
                });
            }

            if (element.IsFolder) {
                var menu = FoodMenuHolder.getMenu().filter(function(item) {
                    return item.Parent === element.id;
                });
                $scope.parent = element;
                $scope.menu = menu;
                $scope.showBackButton = $scope.parent !== nullLink;
            } else {
                if (OrderHolder.getOrderStatus()) {
                    showConfirm();
                }
            }
        }

        $scope.textPrice = function(element) {
            return element.Price !== 0 ? "Цена: " + element.Price : null;
        }

        $scope.prevMenu = function() {
            var prevMenu;
            if ($scope.parent.Parent === nullLink) {
                prevMenu = FoodMenuHolder.getMenu().filter(function(item) {
                    return (item.Parent === nullLink) && (item.Owner === $stateParams.menuTypeId);
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
            $scope.showBackButton = $scope.parent !== null;
        }


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
