textApp.controller('grpchatCtrl',['$scope','$http','$location',function($scope,$http,$location){
	console.log("here");
      /*$scope.add_competition = function(){
            console.log($scope.comp);
            var comp_data={};
 	  $http.post("/add_competition", {comp_data:}).success(function(response){
            if (response.error) 
            {
            	$scope.noError = false;	
            	$scope.ErrorMessage = response.error;
            }
            else
            {
                 
            	$location.path("/AdminDashboard");
            }
	});
 	}*/
}])