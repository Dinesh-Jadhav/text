exports.login = function (){
  return function(req,res){
     sess=req.session;
     var username= req.body.username;
     var password = req.body.password;
     var result = {};
     if((username==null) ){
        result.error = true;
             result.data = "Username not provided";
             res.send(JSON.stringify(result));
             return;
     }else if(password==null){
            result.error = true;
             result.data = "Password not provided";
             res.send(JSON.stringify(result));
             return;
     }else{
          db.collection('users').find({"username":username,"password":password}).toArray(function(err, row)
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
                  first_name :row[0].first_name,
                  last_name :row[0].last_name,
                  mobile :row[0].mobile,
                  email : row[0].email,
                  image : row[0].image_path
                }
                result.error = false;
                result.data = data;
                res.send(JSON.stringify(result));
                return;
                }
          });
        }
    };
}

exports.updatedetails = function(ObjectId){
 return function(req,res){
var result = {};
//console.log(req.body.token);
   if(req.body.token != req.session.token.token){
       result.error = true;
       result.data = " No valid user";
       res.send(JSON.stringify(result));
       return;
   }else if(req.body.first_name == null){
       result.error = true;
       result.data = " First Name not provided";
       res.send(JSON.stringify(result));
   }else if(req.body.last_name == null){
       result.error = true;
       result.data = " Last Name not provided";
       res.send(JSON.stringify(result));
   }else if(req.body.email == null){
        result.error = true;
       result.data = " Email not provided";
       res.send(JSON.stringify(result));
   }else if(req.body.mobile == null){
        result.error = true;
       result.data = " Mobile Number not provided";
       res.send(JSON.stringify(result));
   }else if(req.body.username == null){
        result.error = true;
       result.data = " Username not provided";
       res.send(JSON.stringify(result));
   }else if(req.body.password == null){
        result.error = true;
       result.data = "Password not provided";
       res.send(JSON.stringify(result));
   }else if(req.body.cpassword == null){
        result.error = true;
       result.data = " confirm Password not provided";
       res.send(JSON.stringify(result));
   }else {
      if(req.body.password == req.body.cpassword ){
      var myId = req.params.id;
      var newvalues = {
                first_name : req.body.first_name,
                last_name : req.body.last_name,
                email: req.body.email,
                mobile : req.body.mobile,
                username : req.body.username,
                password : req.body.password,
                image_path :req.body.image_path
      }
      db.collection('admin').updateOne({ "_id":ObjectId(myId)},newvalues, function(err, row) {
       if (err) {
            result.error = true;
            result.data = " somthing going wrong";
            res.send(JSON.stringify(result));
            return;
       }else{
            result.error = false;
            result.data = { "data" :"Updated"};
            res.send(JSON.stringify(result));
            return;
            }
          });
  }else{
            result.error = true;
            result.data = "Passwod and confirm password must be same";
            res.send(JSON.stringify(result));
            return;
  }
   } 
 }
}


exports.getuserdetails = function(ObjectId){
 return function(req,res){
var result = {};
   if(req.headers.token != req.session.token.token){
       result.error = true;
       result.data = " No valid user";
       res.send(JSON.stringify(result));
       return;
   }else if(req.params.id == null){
       result.error = true;
       result.data = "Id not provided";
       res.send(JSON.stringify(result));
       return;
   }else{
      var myId = req.params.id;
      db.collection('admin').findOne({ "_id":ObjectId(myId)}, function(err, row) {
       if (err) {
            result.error = true;
            result.data = " somthing going wrong";
            res.send(JSON.stringify(result));
            return;
       }else{
            result.error = false;
            result.data = row;
            res.send(JSON.stringify(result));
            return;
            }
          });
   } 
 }
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