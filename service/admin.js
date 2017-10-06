exports.login = function (){
  return function(req,res){
     sess=req.session;
     var username= req.body.username;
     var password = req.body.password;
     var result = {};
     if((username!=null) &&(password!=null)){
          db.collection('admin').find({"username":username,"password":password}).toArray(function(err, row)
         {
            //console.log(row);
            if ((row==null)||row.length == 0){
             result.error = true;
             result.data = "User not found";
             res.send(JSON.stringify(result));
             return;
            }else {
                sess.userID = row[0]._id;
                sess.userPrivilege = 1;
                sess.userLevel = "admin";
                var data = {
                  id : row[0]._id,
                  name :row[0].username
                }
                result.error = false;
                result.data = data;
                res.send(JSON.stringify(result));
                return;
                }
          });
        }else{
                result.error = true;
                result.data ="Please send required information";
                res.send(JSON.stringify(result));      
        }
    };
}


exports.logout = function(){
  return function(req, res) {
    req.session = "";
    result = {};
    result.error = false;
    result.data = "Log out successfully";
    res.send(JSON.stringify(result));
  }
}