angular.module('sn')
    .factory('DateUtils',
        function() {

            return {

                convertFormattedTextToDate: function(formattedText) {
                    var year = formattedText.substring(0, 4),
                        month = parseInt(formattedText.substring(4, 6),10)- 1,
                        date = formattedText.substring(6, 8),
                        hours = formattedText.substring(9, 11),
                        minutes = formattedText.substring(12, 13);

                    return new Date(year, month, date, hours, minutes);
                },

                convertFormattedTextToDateWithOutTime: function(formattedText) {
                    var year = formattedText.substring(0, 4),
                        month = parseInt(formattedText.substring(4, 6),10)- 1,
                        date = formattedText.substring(6, 8);

                    return new Date(year, month, date);
                },

                minutesDifferenceBetweenTwoDates: function(startDate, endDate){
                    var difference = Math.abs(startDate - endDate);

                    return Math.floor((difference/1000)/3600);
                },

                totalWorkingHoursPerEmployee: function() {
                    var workingHoursPerDay = 8, //ExcludingLunch
                        totalNumberOfDays = 5;

                    return workingHoursPerDay * totalNumberOfDays;
                }

            }
        }
    );