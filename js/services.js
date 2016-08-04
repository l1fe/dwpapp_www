angular.module('starter.services', [])

    .factory('db', databoomSrv('https://t334.databoom.space', 'b334'))

    .service('DataboomService', function (db) {
        var loginDb = 't334';
        var passwordDb = 'avssn123';
        function load(collection) {
            return db.login(loginDb,passwordDb).then(function () {
                return db.load(collection);
            },function() {
                console.log('The DataboomService login error.');
            });
        }
        function loadWithQueryOptions(collection, filter) {
            return db.login(loginDb, passwordDb).then(function () {
                return db.load(collection,filter);
            }, function () {
                console.log('The DataboomService login error.');
            });
        }
        return {
            load: load,
            loadWithQueryOptions: loadWithQueryOptions
    }
    })

    .factory('FoodMenuHolder', function(DataboomService) {
        var menu;
        var menuType;
        return {
            update: function() {
                DataboomService.load("Menu").then(function(data) {
                    menu = data;
                });
                DataboomService.load("MenuType").then(function(data) {
                    menuType = data;
                });
            },
            getMenu: function() {
                return menu;
            },
            getMenuType: function() {
                return menuType;
            }
        }
    })