angular.module('sn')
    .factory('MainService', [
        'MainFactory',
        function(MainFactory) {

            return {

                getUsers: function () {

                    return MainFactory.httpService({
                        method: 'GET',
                        url: '../data/users.json'
                    });
                },

                getResourceData: function () {

                    return MainFactory.httpService({
                        method: 'GET',
                        url: '../data/resource_event.json'
                    });
                }
            }
        }
    ]);