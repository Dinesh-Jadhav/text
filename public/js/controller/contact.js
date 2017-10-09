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

             var socket = io.connect('http://localhost:8080');
             socket.on('connect', function() {
                            var blockId = 1;
                            socket.emit('addUser', blockId);
                        });

              socket.on('updatechat', function() {
                            $scope.messagess = "updatechat function";
                            $scope.$apply();
                        });
             $scope.residentchat = {};
                            $scope.send = function() {
                            var message = $scope.residentchat.message;
                            // tell server to execute 'sendchat' and send along one parameter
                            var name = "Dinesh";
                            var userID = "res_id";
                            var blockId = 1;
                            var message_by = "this is first msg from angular to server";
                            socket.emit('sendchat', message, name, userID, blockId, message_by);
                            $scope.residentchat.message = '';
                        }
                        $scope.addcontact = function(){
                              console.log(contact);
                              console.log("here");
                        }
           /* $scope.residentchat = {};
            $scope.send = function(){
                  console.log($scope.residentchat);
                  console.log("here");
            }*/
}])