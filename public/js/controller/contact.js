textApp.controller('contactCtrl',['$scope','$http','$location',function($scope,$http,$location){
            var token = localStorage.getItem('token');
            var admindata = JSON.parse(localStorage.getItem("admindetails"))
            console.log(token);
            var contact = {};
            $http.get("/api/v1/contact/",{params: {token: token}}).success(function(response){
            
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
             $scope.messages = [];
             var socket = io.connect('http://localhost:8080');
             socket.on('connect', function() {
                            var blockId = "59db5f9ab33828213d4594f3";
                            socket.emit('addUser', blockId);
                        });

              socket.on('updatechat', function(history) {
                            $scope.messagess = history;
                            console.log($scope.messagess);
                            $scope.$apply();
                        });
              $scope.residentchat = {};
              $scope.send = function() {
                            var message = $scope.residentchat.message;
                            var name = admindata.first_name + ' ' + admindata.last_name;
                            var userID = admindata.id;
                            var blockId = "59db5f9ab33828213d4594f3";
                            var message_by = "Admin";
                            socket.emit('sendchat', message, name, userID, blockId, message_by);
                            $scope.residentchat.message = '';
                        }            
}])
