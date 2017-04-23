angular.module('sn')
    .factory('DataGeneratorService', [
        'DateUtils',
        function (DateUtils) {

            return {

                getUserWorkObject: function (data) {

                    var userWorkObject = {}, i, keys, userId, type;

                    for (i = 0; i < data.length; i++) {
                        keys = Object.keys(userWorkObject);
                        userId = data[i].user.value;
                        type = data[i].type;

                        data[i].startDateTime = DateUtils.convertFormattedTextToDate(data[i].start_date_time);
                        data[i].endDateTime = DateUtils.convertFormattedTextToDate(data[i].end_date_time);

                        if (keys.indexOf(userId) == -1) {
                            userWorkObject[userId] = {};
                            userWorkObject[userId]["task"] = [];
                            userWorkObject[userId]["meeting"] = [];
                            userWorkObject[userId][type].push(data[i]);
                        } else {
                            userWorkObject[userId][type].push(data[i]);
                        }
                    }

                    return userWorkObject;
                },

                generateCalenderRenderableData: function (data) {

                    var calenderData = [], i = 0, tasks, meetings, startDate, endDate;

                    if (data) {
                        tasks = data.task;
                        meetings = data.meeting;

                        for (i = 0; i < tasks.length; i++) {
                            startDate = tasks[i].startDateTime;
                            endDate = tasks[i].endDateTime;

                            calenderData.push({
                                title: tasks[i].name,
                                start: startDate,
                                end: endDate
                            });
                        }

                        for (i = 0; i < meetings.length; i++) {
                            startDate = meetings[i].startDateTime;
                            endDate = meetings[i].endDateTime;

                            calenderData.push({
                                title: meetings[i].name,
                                start: startDate,
                                end: endDate
                            });
                        }
                    }

                    return calenderData;
                },

                getUsersBusyHours: function (users, usersWorkingData) {

                    var usersWorkingHours = {}, userId, userWorkingData, i = 0, j = 0, tasks, meetings,
                        startDate, endDate, taskHours, meetingHours, totalHours = DateUtils.totalWorkingHoursPerEmployee();

                    for (j = 0; j < users.length; j++) {
                        userId = users[j].sys_id;
                        userWorkingData = usersWorkingData[userId];
                        taskHours = 0;
                        meetingHours = 0;

                        if (userWorkingData) {
                            tasks = userWorkingData.task;
                            meetings = userWorkingData.meeting;

                            for (i = 0; i < tasks.length; i++) {
                                startDate = tasks[i].startDateTime;
                                endDate = tasks[i].endDateTime;

                                taskHours += DateUtils.minutesDifferenceBetweenTwoDates(startDate, endDate);
                            }

                            for (i = 0; i < meetings.length; i++) {
                                startDate = meetings[i].startDateTime;
                                endDate = meetings[i].endDateTime;

                                meetingHours += DateUtils.minutesDifferenceBetweenTwoDates(startDate, endDate);
                            }
                        }

                        usersWorkingHours[userId] = {
                            user: users[j],
                            taskHours: taskHours,
                            meetingHours: meetingHours,
                            freeHours: totalHours - (taskHours + meetingHours)
                        };
                    }

                    return usersWorkingHours;
                },

                getUserMaxBusyAndFree: function (users, usersWorkingHours) {

                    var min = DateUtils.totalWorkingHoursPerEmployee(), max = 0,
                        busyUsers = [], freeUsers = [], i, userId, userTotalWorkingHours;

                    for (i = 0; i < users.length; i++) {
                        userId = users[i].sys_id;
                        userTotalWorkingHours = usersWorkingHours[userId]['taskHours'] + usersWorkingHours[userId]['meetingHours'];

                        if (userTotalWorkingHours < min) {
                            freeUsers = [];
                            freeUsers.push(users[i]);
                            min = userTotalWorkingHours;
                        } else if (userTotalWorkingHours === min) {
                            freeUsers.push(users[i]);
                        }

                        if (userTotalWorkingHours > max) {
                            busyUsers = [];
                            busyUsers.push(users[i]);
                            max = userTotalWorkingHours;
                        } else if (userTotalWorkingHours === max) {
                            busyUsers.push(users[i]);
                        }
                    }

                    return {busyUsers: busyUsers, freeUsers: freeUsers};
                },

                checkUsersBusyInMorningHours: function (users, usersWorkingData) {

                    var usersBusyWorkingHours = [], userId, userWorkingData, i = 0, j = 0, tasks, meetings, isBusy,
                        startDate, endDate, dateRangeStart = 6, dateRangeStartEnd = 11, usersObject = [], startDateTime;

                    var checkForMorningHour = function (startDate, endDate) {
                        var startHour = startDate.getHours(), endHour = endDate.getHours();

                        if (startHour >= 12) {
                            return 0;
                        } else {
                            if (endHour > 12) {
                                endHour = 12;
                            }
                            return endHour - startHour;
                        }
                    };

                    for (j = 0; j < users.length; j++) {
                        userId = users[j].sys_id;
                        usersObject[userId] = {};
                        userWorkingData = usersWorkingData[userId];

                        for (i = dateRangeStart; i < dateRangeStartEnd; i++) {
                            usersObject[userId][new Date(2017, 2, i, 0, 0)] = {workingHours: 0};
                        }

                        if (userWorkingData) {
                            tasks = userWorkingData.task;
                            meetings = userWorkingData.meeting;

                            for (i = 0; i < tasks.length; i++) {
                                startDate = tasks[i].startDateTime;
                                endDate = tasks[i].endDateTime;
                                startDateTime = tasks[i].start_date_time;

                                usersObject[userId][DateUtils.convertFormattedTextToDateWithOutTime(startDateTime)]["workingHours"] += checkForMorningHour(startDate, endDate);
                            }

                            for (i = 0; i < meetings.length; i++) {
                                startDate = meetings[i].startDateTime;
                                endDate = meetings[i].endDateTime;
                                startDateTime = meetings[i].start_date_time;

                                usersObject[userId][DateUtils.convertFormattedTextToDateWithOutTime(startDateTime)]["workingHours"] += checkForMorningHour(startDate, endDate);
                            }
                        }

                    }

                    for (j = 0; j < users.length; j++) {
                        userId = users[j].sys_id;
                        isBusy = false;
                        for (i = dateRangeStart; i < dateRangeStartEnd; i++) {
                            if (usersObject[userId][new Date(2017, 2, i, 0, 0)]["workingHours"] >= 3) {
                                isBusy = true;
                            }
                        }

                        if (!isBusy) {
                            usersBusyWorkingHours.push(users[j]);
                        }
                    }

                    return usersBusyWorkingHours;
                }
            }
        }
    ]);