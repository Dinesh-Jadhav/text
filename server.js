// =================================================================
// get the packages we need ========================================
// =================================================================
var express   = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var session = require('express-session');
var mongoose = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var crypto = require('crypto');
var multer = require('multer');
var fs = require("fs");
var path = require('path');
//routes
var users = require('./service/users');
var admin = require('./service/admin');
var upload = require('./service/upload');
var contact = require('./service/contacts');
var group = require('./service/groups');
var message = require('./service/message');

var port = process.env.PORT || 8080; 
//var server = app.listen(port);

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(session({secret: 'secret',saveUninitialized: true,resave: true}));
// =================================================================
// configuration ===================================================
// =================================================================
    var http = require('http');
    var server = http.createServer(app);
    var io = require('socket.io').listen(server);
    var usernames = {};
    var room = []
    var rooms = [];
    io.sockets.on('connection', function(socket) {
      
       socket.on('addUser', function(blockID) {
       // store the room name in the socket session for this client
            socket.room = blockID;
            socket.join(blockID);
            getChatHistory(blockID, function(history) {
                io.sockets.in(blockID).emit('updatechat', history);
                socket.broadcast.to(blockID).emit('updatechat', history);
            });
        });

       socket.on('sendchat', function(data, userName, user_id, block_id, message_by) {
           console.log(data, userName, user_id, block_id, message_by);
            // we tell the client to execute 'updatechat' with 4 parameters
           addChatInDatabase(data, userName, user_id, block_id, message_by);
            });


        function addChatInDatabase(data, userName, user_id, block_id) {
        var record =
            {
        sender_id : user_id,
        msg_status : "send",
        text : data,
        sendtimestamp :Date.now(),
        recievetimestamp :Date.now(),
        readtimestamp :Date.now(),
        receiver_id : block_id,
        chatroom_id : block_id,
        is_deleted : 0
          }
          db.collection('message').insert(record , function(err,rows){
              if(err){
                 console.log(err); 
              }else{
                getChatHistory(block_id, function(rowsdata) {
                  io.sockets.in(block_id).emit('updatechat', rowsdata);
                  socket.broadcast.to(block_id).emit('updatechat', rowsdata);
                });    
              }
            })
          }

        });

    function getChatHistory(block_id, callback) {
        console.log(block_id);
        var result = {};
          db.collection('message').find({"chatroom_id":block_id}).toArray(function(err, rows) {
           if (err) {
             console.log(err);
             callback([]);
              }else{
             callback(rows);
            }
         });
      }
  /*function addChatInDatabase(data, userName, user_id, block_id, callbackForInsert()) {
        var record =
            {
        sender_id : user_id,
        msg_status : "send",
        text : data,
        sendtimestamp :Date.now(),
        recievetimestamp :Date.now(),
        readtimestamp :Date.now(),
        receiver_id : block_id,
        chatroom_id : block_id,
        is_deleted : 0
          }
          db.collection('message').insert(record , function(err,rows){
              if(err){
                 console.log(err); 
              }else{
                getChatHistory(block_id, function(rowsdata) {

                  callbackForInsert(rowsdata);
                });    
              }
            })
          }*/

      
// used to create, sign, and verify tokens
mongoose.connect(config.database, function(err,database) {
    if(err) {
        console.error(err);
     }else{
    db = database;
    } 
    });
//mongoose.connect('mongodb://localhost:27017/textapp'); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

//admin

app.post('/login',admin.login());
app.post('/logout',admin.logout());
apiRoutes.put('/admin/:id',admin.updatedetails(ObjectId));
apiRoutes.get('/admin/:id',admin.getuserdetails(ObjectId));
//app.post('/upload',upload.upload(multer,path));

//user details added by admin
app.post('/userlogin',users.login(crypto));
apiRoutes.get('/user/',users.getallusers());
apiRoutes.get('/user/:id',users.getuserdetails(ObjectId));
apiRoutes.post('/user',users.addnewusers(crypto));
apiRoutes.delete('/user/:id',users.deleteuser(ObjectId));
apiRoutes.put('/user/:id',users.updatedetails(ObjectId));
//apiRoutes.post('/user',users.addnewusers(crypto));

//contact details by admin

apiRoutes.get('/contact',contact.getallcontacts());
apiRoutes.get('/contact/:id',contact.getcontactdetails(ObjectId));
apiRoutes.post('/contact',contact.addnewcontact());
apiRoutes.delete('/contact/:id',contact.deletecontact(ObjectId));
apiRoutes.put('/contact/:id',contact.updatecontact(ObjectId));

//group 

apiRoutes.post('/creategroup',group.createchatroom(ObjectId));
apiRoutes.post('/addparticipant',group.addparticipanttogrp(ObjectId));


// Messages
apiRoutes.post('/message',message.addnewusersmessage(crypto));
apiRoutes.get('/message/:id',message.messagesbyid(ObjectId));

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/images')
  },
  filename: function(req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

app.post('/file', function(req, res) {
  var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
      var ext = path.extname(file.originalname);
      callback(null, true)
    }
  }).single('userFile');
  upload(req, res, function(err) {
        var result = {};
        var fileobject = {
        filename : req.file.filename,
        path :req.file.path,
        mimetype : req.file.mimetype
      } 
     db.collection('image').insertOne(fileobject ,function(err,row){
     if(err){
     result.error = true;
     result.data = "upload fail"
     res.send(JSON.stringify(result));
     return;      
       }else{
      result.error = false;
     result.data = fileobject;
     res.send(JSON.stringify(result));
     }
    })
  })
})

apiRoutes.post('/authenticate', function(req, res) {
     var result = {};
     if(req.session.userLevel == undefined || req.session.userLevel == ""  ){
     result.error = true;
     result.data = "Authentication Failed"
     res.send(JSON.stringify(result));
     return;
     }else{
          var payload = {
          admin: req.session.userLevel
        }
        var token = jwt.sign(payload, app.get('superSecret'));
         result.error = false;
         var token = {
          token: token
         }
         req.session.token= token;
         result.data = token;
         res.send(JSON.stringify(result));
      }
});

apiRoutes.use(function(req, res, next) {
  var token = req.body.token || req.param('token') || req.headers['x-access-token'];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;  
        next();
      }
    });
  } else {
    return res.status(403).send({ 
      error: true, 
      message: 'No token provided.'
    });
  }
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------

app.use('/api/v1', apiRoutes);


// =================================================================
// start the server ================================================
// =================================================================
server.listen(port);


console.log('Magic happens at http://localhost:' + port);



