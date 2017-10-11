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
                  //console.log(response.data);
                  localStorage.setItem("admindetails",JSON.stringify(response.data));
                  //var admindata = JSON.parse(localStorage.getItem("admindetails"));
                 
             	$location.path("/AdminDashboard");
            }
	});
 	}
}])