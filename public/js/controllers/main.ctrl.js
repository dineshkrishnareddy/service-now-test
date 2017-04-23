angular.module('sn')
    .controller('main', [
        '$scope',
        '$timeout',
        'MainService',
        'DataGeneratorService',
        function ($scope, $timeout, MainService, DataGeneratorService) {

            $scope.users = [];
            $scope.showCalender = true;
            $scope.calenderRenderableData = [];

            $scope.init = function (users, userWorkData) {

                $scope.users = users;
                $scope.userWorkData = DataGeneratorService.getUserWorkObject(userWorkData);
                $scope.userWorkingHours = DataGeneratorService.getUsersBusyHours($scope.users, $scope.userWorkData);
                $scope.userBusyAndFreeObject = DataGeneratorService.getUserMaxBusyAndFree($scope.users, $scope.userWorkingHours);
                $scope.usersBusyMorningHours = DataGeneratorService.checkUsersBusyInMorningHours($scope.users, $scope.userWorkData);

                $scope.arrFromObject = Object.keys($scope.userWorkingHours).map(function (key) {
                    return $scope.userWorkingHours[key];
                });
            };

            MainService.getUsers().then(function (data) {

                var users = data.result;

                MainService.getResourceData().then(function (data) {
                    $scope.init(users, data.result);
                });
            });

            $scope.changeUser = function () {

                var userId = $scope.userSelected.sys_id;

                $scope.showCalender = null;
                $scope.calenderRenderableData = DataGeneratorService.generateCalenderRenderableData($scope.userWorkData[userId]);
                $timeout(function () {
                    $scope.showCalender = true;
                })
            };
        }
    ]);