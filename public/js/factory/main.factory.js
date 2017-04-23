angular.module('sn')
    .factory('MainFactory', [
        '$http',
        '$q',
        function($http, $q) {

            return {

                httpService: function (config) {

                    var deferred = $q.defer();

                    $http(config).then(function(response){

                        deferred.resolve(response.data);
                    }, function(error){

                        deferred.reject(error);
                    });

                    return deferred.promise;
                }
            }
        }
    ]);