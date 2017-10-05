textApp.controller('login_ctrl',['$scope','$http','$location',function($scope,$http,$location){
	$scope.login = function(){
            //console.log($scope.email,$scope.password);
 	  $http.post("/login", {username:$scope.email, password: $scope.password}).success(function(response){
            if (response.error==true) 
            {
            	$scope.noError = false;	
            	$scope.ErrorMessage = response.error;
                  $location.path("/admin-login");
            }else
            {
             	$location.path("/AdminDashboard");
            }
	});
 	}
}])