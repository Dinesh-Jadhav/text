
exports.addmessage = function() {
	return function(req,res){
   var result = {};
   console.log(req.body);
    if(req.body.token != req.session.token.token){
       result.error = true;
       result.data = " No valid token provided";
       res.send(JSON.stringify(result)); 
   }else{
          	/*var record ={
				sender_id : req.body.sender_id,
				msg_status : req.body.message_status,
				text : req.body.text,
				timestamp :new Date(),
				receiver_id : req.body.receiver_id,
				is_deleted : req.body.is_deleted
					}*/
	       	db.collection('message').insert({
				sender_id : req.body.sender_id,
				msg_status : req.body.message_status,
				text : req.body.text,
				timestamp :new Date(),
				receiver_id : req.body.receiver_id,
				is_deleted : req.body.is_deleted
					}, function(err,row){
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
 }


exports.addnewusersmessage = function(crypto) {
   return function(req,res){
   var result = {};
   console.log(req.body);
    if(req.body.token != req.session.token.token){
       result.error = false;
       result.data = " No valid token provided";
       res.send(JSON.stringify(result)); 
   }else{

   
	       	var record =
	       		{
				sender_id : req.body.sender_id,
				msg_status : req.body.msg_status,
				text : req.body.text,
				sendtimestamp :Date.now(),
				recievetimestamp :Date.now(),
				readtimestamp :Date.now(),
				receiver_id : req.body.receiver_id,
				is_deleted : req.body.is_deleted
					}
	       	db.collection('message').insert(record , function(err,row){
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
 }

exports.messagesbyid = function(ObjectId){
 return function(req,res){
var result = {};
   if(req.headers.token != req.session.token.token){
   	   result.error = true;
       result.data = " No valid user";
       res.send(JSON.stringify(result));
       return;
   }else {
   		console.log(req.params.id)
	  db.collection('message').find({"reciever ":req.params.id}).toArray(function(err, row) {
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
