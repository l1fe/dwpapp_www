angular.module('starter.services', [])
    .factory('db', databoomSrv('https://t334.databoom.space', 'b334'))
    .service('DataboomService', function(db) {
        var loginDb = 't334';
        var passwordDb = 'avssn123';

        function load(collection) {
            return db.login(loginDb, passwordDb).then(function() {
                return db.load(collection);
            }, function() {
                console.log('The DataboomService login error!');
            });
        }

        function loadWithQueryOptions(collection, filter) {
            return db.login(loginDb, passwordDb).then(function() {
                return db.load(collection, filter);
            }, function() {
                console.log('The DataboomService login error!');
            });
        }

        return {
            load: load,
            loadWithQueryOptions: loadWithQueryOptions
        }
    })
    .factory('TableMenuHolder', function(DataboomService) {
        var tables;

        function update() {
            return DataboomService.load("Table").then(function(data) {
                tables = data;
                return data;
            });
        }

        return {
            getTables: function() {
                return tables;
            },
            update: update
        }
    })
    .factory('FoodMenuHolder', function(DataboomService) {
        var menu;
        var menuType;

        function update() {
            DataboomService.load("Menu").then(function(data) {
                menu = data;
            });
            DataboomService.load("MenuType").then(function(data) {
                menuType = data;
            });
        }

        return {
            update: update,

            getMenu: function() {
                return menu;
            },
            getMenuType: function() {
                return menuType;
            }
        }
    })
    .factory('OrderHolder', function() {
        var orderIsOpen;

        var order = {
            id: "",
            StartTime: 0,
            EndTime: 0,
            Client: "",
            Table: "",
            Menu: [],
            collections: [
                {
                    id: "Reserved"
                }
            ]
        };

        var menu = [];

        return {
            setOrderStatus: function(status) {
                orderIsOpen = status;
            },
            getOrderStatus: function () {
                return orderIsOpen;
            },
            initOrder: function() {
                order = {
                    id: "",
                    StartTime: 0,
                    EndTime: 0,
                    Client: "",
                    Table: "",
                    Menu: [],
                    collections: [
                        {
                            id: "Reserved"
                        }
                    ]
                }
            },
            setClient: function(client) {
                order.Client = client;
            },
            setTable: function(table) {
                order.Table = table;
            },
            addToMenu: function (obj) {
                menu[menu.length] = obj;
            },
            getMenu: function() {
                return menu;
            },
            sentOrder: function() {
                
            }
    }
    })