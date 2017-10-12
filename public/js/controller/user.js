textApp.controller('userCtrl',['$scope','$http','$location',function($scope,$http,$location){
            var token = localStorage.getItem('token');
            console.log(token);
            $http.get("/api/v1/user/",{params: {token: token}}).success(function(response){
            console.log(response);
            /*if (response.error) 
            {
            	$scope.noError = false;	
            	$scope.ErrorMessage = response.error;
            }
            else
            { 
            	$location.path("/AdminDashboard");
            }*/
	});
}])