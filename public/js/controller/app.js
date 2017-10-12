'use strict';
var textApp = angular.module('textApp', ['ngRoute']);
textApp.value('socketUrl', 'http://localhost:8080');
textApp.config(['$routeProvider',function($routeProvider){
//admin login
	$routeProvider
    .when('/admin-login',{
    templateUrl:'../html/admin/login.html',
    controller:'login_ctrl',
      }).when('/AdminDashboard',{
    templateUrl:'../html/admin/dashboard.html',
    controller:'',
    activetab:'dashboard'
    }).when('/add_competition',{
    templateUrl:'../html/competition/add_compitation.html',
    controller:'competition_add',
    activetab:'ticker'
    }).when('/list',{
    templateUrl:'../html/user/userList.html',
    controller:'userCtrl',
    activetab:'user'
    }).when('/contactlist',{
    templateUrl:'../html/contact/contact.html',
    controller:'contactCtrl',
    activetab:'contact'
    }).when('/addcontact',{
    templateUrl:'../html/contact/addcontact.html',
    controller:'contactCtrl',
    activetab:'contact'
    }).when('/groupchat',{
    templateUrl:'../html/chat/groupchat.html',
    controller:'grpchatCtrl',
    activetab:'chat'
    }).otherwise({redirectTo:'/admin-login'});
}]);

textApp.controller('headerController', function($scope, $route) {
    $scope.$route = $route;
});


/*textApp = angular.module('textApp', ['textApp.controllers','datatables']);
  
  angular.module('textApp.controllers', []).controller('testController', function($scope,DTOptionsBuilder, DTColumnBuilder, $compile) {
  });*/