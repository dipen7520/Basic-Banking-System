var app = angular.module('myApp', []);
var app = angular.module('myApp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'first.html',
            controller: 'FirstController'
        })

        .when('/second', {
            templateUrl: 'second.html',
            controller: 'SecondController'
        })

        .when('/third', {
            templateUrl: 'third.html',
            controller: 'ThirdController'
        })

        .otherwise({ redirectTo: '/' });
});

app.controller('FirstController', function ($scope) {
    $scope.message = 'Hello from FirstController';
});

app.controller('SecondController', function ($scope, $http, $templateCache) {
    $scope.amount = 0;
    $scope.list = function () {
        var url = 'http://localhost:2803/getUsers';
        $http.get(url).success(function (data) {
            $scope.users = data;
        });
    };
    $scope.list();
    $scope.selectFrom = function (dataFrom) {
        $scope.userFrom = dataFrom;
        $('#select-btn').hide();
        $('#transfer-btn').show();
    };
    $scope.selectTo = function (dataTo) {
        $scope.userTo = dataTo;
        $('#select-btn').show();
        $('#transfer-btn').hide();
    };
    $scope.Transfer = function (TrFrom, TrTo, amount) {
        var insertMethod = 'POST';
        var updateMethod = 'PUT';
        var inserturl = 'http://localhost:2803/insertUser';
        var updateUrl = 'http://localhost:2803/updateUser';
        $scope.amount = 0;
        if (TrFrom.balance >= amount && TrFrom.email != TrTo.email) {

            var x1 = TrFrom.balance - amount;
            var x2 = TrTo.balance + amount;

            var formData = {
                "nameFrom": TrFrom.name,
                "emailFrom": TrFrom.email,
                "nameTo": TrTo.name,
                "emailTo": TrTo.email,
                "amount": amount
            };
            var jdata = 'mydata=' + JSON.stringify(formData);

            $http({
                method: insertMethod,
                url: inserturl,
                data: jdata,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                cache: $templateCache
            }).
                success(function (response) {
                }).
                error(function (response) {
                });

            var UpdateData = {
                "idFrom": TrFrom.email,
                "idTo": TrTo.email,
                "blFrom": x1,
                "blTo": x2
            };
            var udata = 'updatedata=' + JSON.stringify(UpdateData);
            $http({
                method: updateMethod,
                url: updateUrl,
                data: udata,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                cache: $templateCache
            }).
                success(function (response) {
                    window.alert("money transfer successfully");
                    $scope.list();
                }).
                error(function (response) {
                    window.alert("somthing wrong");
                });
        }
        else {
            window.alert("Do Valid Transaction");
        }
    };
});

app.controller('ThirdController', function ($scope, $http) {
    $scope.message = 'Hello from ThirdController';
    $scope.listHistory = function () {
        var url = 'http://localhost:2803/getHistory';
        $http.get(url).success(function (HistoryData) {
            $scope.history = HistoryData;
        });
    };
    $scope.listHistory();
});