
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
						"timestamp" :  new Date(Date.UTC()),
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
 			var grp_id =req.body.group_name;
 			db.collection.find({"_id ":ObjectId(grp_id)},function(){

 			}) 

			var record ={
						"group_icon" : req.body.group_icon,
						"group_name" : req.body.group_name,
						"is_group" : req.body.is_group,
						"addedasfreind" : req.body.addedasfreind,
						"lastmsgsentby" : req.body.lastmsgsentby,
						"last_msg" : req.body.last_msg,
						"timestamp" :  new Date(Date.UTC()),
						"userLists" : req.body.userLists,
						"status":req.body.status
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