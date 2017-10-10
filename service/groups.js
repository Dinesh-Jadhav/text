
exports.createchatroom = function() {
	return function(req,res){
   var result = {};
   if(req.session.token.token =="" || req.session.token.token ==undefined){
   	result.error = true;
       result.data = " No vallide user";
       res.send(JSON.stringify(result));
   }else if(req.body.token != req.session.token.token){
       result.error = true;
       result.data = " No vallide token provided";
       res.send(JSON.stringify(result)); 
   }else{
   	console.log(req.body);
   	        if(req.body.userLists.length<2){
	       	result.error = true;
			    result.data = "please add more than 2 members in group";
			    res.send(JSON.stringify(result));
			}else{

				var record ={
						"group_icon" : req.body.group_icon,
						"group_name" : req.body.group_name,
						"is_group" : req.body.is_group,
						"addedasfreind" : req.body.addedasfreind,
						"lastmsgsentby" : req.body.lastmsgsentby,
						"last_msg" : req.body.last_msg,
						"timestamp" : Date.now(),
						"userLists" : req.body.userLists,
						"status":req.body.status
					}
			}		

	       	db.collection('chatRoom').insert(record , function(err,row){
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

exports.addparticipanttogrp = function(ObjectId) {
	return function(req,res){
		console.log(req.body);
   var result = {};
   if(req.session.token.token =="" || req.session.token.token ==undefined){
   	result.error = true;
       result.data = " No vallide user";
       res.send(JSON.stringify(result));
   }else if(req.body.token != req.session.token.token){
       result.error = true;
       result.data = " No vallide token provided";
       res.send(JSON.stringify(result)); 
   }else{
 			var grp_id =req.body.group_id;
 			
 			db.collection('chatRoom').find({"_id ":ObjectId(grp_id)}).toArray(function(err,row){
 				if(row.length<1){
 					result.error = true;
       				result.data = "Group not found";
       				res.send(JSON.stringify(result));			
 				}else{
 					
					
//db.chatRoom.({"_id":ObjectId("59db5f9ab33828213d4594f3") },{$push: {userLists:{ "item" :"test","sdfjh":"sdkjfh"}}},{safe: true, upsert: true});
db.collection('chatRoom').findOneAndUpdate({"_id ":ObjectId(req.body.group_id)},{$push: {
             userLists: {
						"user_id" : req.body.user_id,
						"device_token" : req.body.device_token,
						"mobileNo" : req.body.mobileNo,
						"email" : req.body.email,
						"image" : req.body.image,
						"last_seen" : req.body.last_seen,
						"status" : req.body.status,
						"name" : req.body.name
					}}},{ safe: true, upsert: true }, function (err, updated) {
          if (err) {
              console.log(err)
          }else{
          	console.log("updated");
          	result.error = true;
       		result.data = "added participant to group";
       		res.send(JSON.stringify(result)); 
          }
       });	
  	  }
 	 }) 
   }
 }
}