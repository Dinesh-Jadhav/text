textApp.directive('header', ['$compile', '$http', '$location', '$route', function($compile, $http, $location, $route) {
    return {
        restrict: 'E',
        templateUrl: '../html/header.html',
        transclude: true,
        link: function(scope, element, attrs) {
                scope.$emit('LOAD');
                $http.post("/api/v1/authenticate").success(function(response, status, headers, config) {
                    scope.$emit('UNLOAD');
                    if (response.error == false) {
                        localStorage.setItem("token",response.data.token);
                       // console.log(localStorage.getItem('token')); 
                    } else {
                        $location.path("/admin-login");
                    }
                });
            
          scope.logout = function() {
                scope.$emit('LOAD');
                $http.post("/logout").success(function(response, status, headers, config) {
                    scope.$emit('UNLOAD');
                    $location.path("/");
                });
            };
        }
    }
}]);



