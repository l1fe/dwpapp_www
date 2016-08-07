angular.module('starter.services', [])
    .factory('db', databoomSrv('https://t334.databoom.space', 'b334'))

    .service('DataboomService', function(db) {
        var loginDb = 't334';
        var passwordDb = 'avssn123';

        return {
            load: function(collection) {
                return db.login(loginDb, passwordDb).then(function() {
                    return db.load(collection);
                }, function() {
                    console.log('The DataboomService login error!');
                });
            },
            loadWithQueryOptions: function(collection, filter) {
                return db.login(loginDb, passwordDb).then(function() {
                    return db.load(collection, filter);
                }, function() {
                    console.log('The DataboomService login error!');
                });
            },
            save: function(label, obj) {
                return db.login(loginDb, passwordDb).then(function() {
                    return db.save(label, obj);
                }, function() {
                    console.log('The DataboomService error!');
                });
            }
        }
    })

    .factory('TableMenuHolder', function(DataboomService) {
        var tables;
        return {
            getTables: function() {
                return tables;
            },
            update: function() {
                return DataboomService.load("Table").then(function(data) {
                    tables = data;
                    return data;
                });
            }
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
    .factory('OrderHolder', function(DataboomService) {
        var orderIsOpen;
        var order;
        var initOrder = function() {
            order = {
                id: "",
                StartTime: 0,
                EndTime: 0,
                Client: "",
                Table: "",
                Menu: []
            }
        }
        initOrder();
        return {
            setOrderStatus: function(status) {
                orderIsOpen = status;
            },
            getOrderStatus: function() {
                return orderIsOpen;
            },
            initOrder: initOrder,
            setClient: function(client) {
                order.Client = client;
            },
            setTable: function(table) {
                order.Table = table;
            },
            addToMenu: function(obj) {
                if (order.Menu.some(function(item) {
                    return item.Numenclature === obj.id;
                })) {
                    order.Menu.forEach(function(item) {
                        if (item.Numenclature === obj.id) {
                            item.Quantity++;
                            item.Sum += item.Sum;
                        }
                    });
                } else {
                    var food = {
                        Numenclature: obj.id,
                        Quantity: 1,
                        Price: obj.Price,
                        Sum: obj.Price
                    }
                    order.Menu[order.Menu.length] = food;
                    console.log(food);
                }
            },
            getMenu: function() {
                return order.Menu;
            },
            sentOrder: function() {
                DataboomService.save("Reserved", order);
                initOrder();
                orderIsOpen = false;
            }
        }
    })