
textApp.directive('chat', ['$compile', 'socketUrl', '$routeParams', function($compile, socketUrl, $routeParams) {
    return {
        restrict: 'E',
        templateUrl: '../html/user/chat.html',
        link: function(scope, element, attrs) {
            /*Socket Initialization*/

            scope.chat = {};
           /* var id = window.atob($routeParams.blockID);
            var userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
            var mgr_id = userDetails.id;
            $scope.currentUserId = mgr_id;
            $scope.message_by = 'Block Manager';
            var mgr_nm = userDetails.manager_name;
*/            scope.messages = [];
            console.log(socketUrl);
            console.log("userchat");
            var socket = io.connect(socketUrl);
            // on connection to server, ask for user's name with an anonymous callback
            /*socket.on('connection', function() {
                console.log("here");
                
            });*/
            var blockId = 1;
            socket.emit('addUser', blockId);

            socket.on('updatechat', function(history) {
                $scope.messages = history;
            });

            scope.send = function() {
                console.log(scope.chat.message);
                var message = scope.chat.message;
                // tell server to execute 'sendchat' and send along one parameter
                //var name = mgr_nm + '' + $scope.message_by;
                //var userID = mgr_id;
                var blockId = 1;
                //var message_by = $scope.message_by;
                socket.emit('sendchat', message, blockId);
                scope.chat.message = '';
            }
        }
    }
}]);

textApp.directive('userchat', ['$compile', 'socketUrl', '$routeParams', '$http', '$timeout', function($compile, socketUrl, $routeParams, $http, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '../html/contact/chat.html',
        link: function(scope, element, attrs) {
            /*Socket Initialization*/
/*
            $scope.residentchat = {};*/
            /*var id = window.atob($routeParams.blockID);*/
            /*var userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
            console.log(userDetails);
            var res_id = userDetails.id;
            var block_id = '';
            $http.post('/residentsBlockId', { resident_id: res_id }).success(function(response) {
                if (response.hasOwnProperty('success')) {
                    block_id = response.success.id;
                }
            });

            $scope.currentUserId = res_id;
            var flat_no = userDetails.flat_id;
            var res_nm = userDetails.first_name + " " + userDetails.last_name;
            $scope.message_by = res_nm + ' ' + " - " + flat_no;
*/
            scope.messagess = [];

            var socket = io.connect(socketUrl);
            // on connection to server, ask for user's name with an anonymous callback

            socket.on('connect', function() {
                var blockId = block_id;
                socket.emit('addUser', blockId);
            });
            /*
            socket.on('updatechat', function(history) {
                $scope.messagess = history;
            });
            */
            scope.send = function() {
                var message =scope.residentchat.message;
                // tell server to execute 'sendchat' and send along one parameter
               // var name = $scope.message_by;
                //var userID = res_id;
                var blockId = 1;
                //var message_by = $scope.message_by;
                socket.emit('sendchat', message,  blockId, );
                scope.residentchat.message = '';
            }
        }
    }
}]);
