angular.module('sn')
    .directive('calenderComponent',
        function () {
            var calenderCtrl = function ($scope) {
                $('#calendar').fullCalendar(
                {
                    header: {
                        left: 'prev,today,next',
                        center: 'title',
                        right: 'agendaDay,agendaWeek,month'
                    },
                    defaultView: 'month',
                    defaultDate: moment('2017-03-06'),
                    selectHelper: true,
                    events: $scope.rendarableData
                });
            };

            return {
                templateUrl: '../views/calender.html',
                scope: {
                    'rendarableData': '='
                },
                controller: calenderCtrl
            }
        }
    );