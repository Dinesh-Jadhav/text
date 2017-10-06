textApp.controller('contactCtrl',['$scope','$http','$location',function($scope,$http,$location){
            var token = localStorage.getItem('token');
            console.log(token);
            var contact = {};
            $http.get("/api/contact/",{params: {token: token}}).success(function(response){
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

            $scope.addcontact = function(){
                  console.log(contact);
                  console.log("here");
            }
}])