
exports.getallusers = function() {
	return function(req,res){
   var result = {};
   if(req.query.token != req.session.token.token){
       result.error = false;
       result.data = " No vallide token provided";
       res.send(JSON.stringify(result)); 
   }else{
   db.collection('users').find().toArray(function(err,row){
      if(err) throw err;
       result.error = false;
       result.data = row;
       res.send(JSON.stringify(result)); 
    })
  }
 }
}

exports.addnewusers = function(crypto) {
	return function(req,res){
   var result = {};
   if(req.session.token.token =="" || req.session.token.token ==undefined){
   	result.error = false;
       result.data = " No vallide user";
       res.send(JSON.stringify(result));
   }else if(req.body.token != req.session.token.token){
       result.error = false;
       result.data = " No vallide token provided";
       res.send(JSON.stringify(result)); 
   }else{
       db.collection('users').find({ email:req.body.email}).toArray(function(err,row){
       if(err){
           result.error = true;
	       result.data = "somthing going wrong";
	       res.send(JSON.stringify(result));
	       return;
       	}else{
       	if(row.length > 1){
	       result.error = true;
	       result.data = "email already exist";
	       res.send(JSON.stringify(result));
	       return;
	       }else{
	       	var record ={
	       		name : req.body.name,
	       		email: req.body.email,
	       		hash : crypto.createHash('sha256').update(req.body.password).digest('base64'),
	       		mobile : req.body.mobile_number,
	       		username : req.body.username
	       	}
	       	db.collection('users').insert(record , function(err,row){
	       		if(err){
	       			result.error = true;
		       		result.data = "error in insert";
		       		res.send(JSON.stringify(result));
		       		return;	
	       		}else{
			       result.error = false;
			       result.data = "success";
			       res.send(JSON.stringify(result));
			       return;
		   		}
	       	})
	       }
       	} 
    })
  }
 }
}

exports.deleteuser = function(ObjectId){
 return function(req,res){
var result = {};
console.log(req.body.token);
console.log(req.session.token.token);
   if(req.body.token != req.session.token.token){
   	   result.error = true;
       result.data = " No vallide user";
       res.send(JSON.stringify(result));
       return;
   }else {
      var myId = req.params.id;
	  db.collection('users').deleteOne({ "_id":ObjectId(myId)}, function(err, obj) {
	   if (err) {
	   	    result.error = true;
		    result.data = " somthing going wrong";
		    res.send(JSON.stringify(result));
		    return;
	   }else{
		    result.error = false;
		    result.data = " deleted";
		    res.send(JSON.stringify(result));
		    return;
		 	}
		  });
   } 
 }
}


exports.getuserdetails = function(ObjectId){
 return function(req,res){
var result = {};
   if(req.headers.token != req.session.token.token){
   	   result.error = true;
       result.data = " No vallide user";
       res.send(JSON.stringify(result));
       return;
   }else {
   	  var myId = req.params.id;
	  db.collection('users').findOne({ "_id":ObjectId(myId)}, function(err, row) {
	   if (err) {
	   	    result.error = true;
		    result.data = " somthing going wrong";
		    res.send(JSON.stringify(result));
		    return;
	   }else{
		    result.error = false;
		    console.log(row);
		    result.data = row;
		    res.send(JSON.stringify(result));
		    return;
		 	}
		  });
   } 
 }
}



exports.updatedetails = function(ObjectId){
 return function(req,res){
var result = {};
   if(req.headers.token != req.session.token.token){
   	   result.error = true;
       result.data = " No vallide user";
       res.send(JSON.stringify(result));
       return;
   }else {
   	  var myId = req.params.id;
	  db.collection('users').updateOne({ "_id":ObjectId(myId)},, function(err, row) {
	   if (err) {
	   	    result.error = true;
		    result.data = " somthing going wrong";
		    res.send(JSON.stringify(result));
		    return;
	   }else{
		    result.error = false;
		    console.log(row);
		    result.data = row;
		    res.send(JSON.stringify(result));
		    return;
		 	}
		  });
   } 
 }
}

db.collection("customers").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();