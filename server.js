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


app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(session({secret: 'secret',saveUninitialized: true,resave: true}));
// =================================================================
// configuration ===================================================
// =================================================================

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
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

app.post('/login',admin.login());
app.post('/logout',admin.logout());
//app.post('/upload',upload.upload(multer,path));

//user details added by admin
apiRoutes.get('/user/',users.getallusers());
apiRoutes.get('/user/:id',users.getuserdetails(ObjectId));
apiRoutes.post('/user',users.addnewusers(crypto));
apiRoutes.delete('/user/:id',users.deleteuser(ObjectId));
apiRoutes.put('/user/:id',users.updatedetails(ObjectId));
apiRoutes.post('/user',users.addnewusers(crypto));

//contact details by admin
apiRoutes.get('/contact',contact.getallcontacts());
apiRoutes.get('/contact/:id',contact.getcontactdetails(ObjectId));
apiRoutes.post('/contact',contact.addnewcontact());
apiRoutes.delete('/contact/:id',contact.deletecontact(ObjectId));
apiRoutes.put('/contact/:id',contact.updatecontact(ObjectId));

//server socket io

 var http = require('http');
    var server = http.createServer(app);
    var io = require('socket.io').listen(server);
    var usernames = {};
    var room = []
    var rooms = [];
     /*io.sockets.on('connection', function(socket) {
       console.log('connected');
       socket.on('addUser', function(blockID) {
       
       })
   });*/
   io.on('connection', function(socket){
  console.log("connect")
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log(msg);
  });
});
/*
    io.sockets.on('connection', function(socket) {
        socket.on('addUser', function(blockID) {
            // store the room name in the socket session for this client
            socket.room = blockID;
            // add the client's username to the global list
            //usernames[userName] = userName;
            // send client to room 1
            socket.join(blockID);
            /*socket.emit('updatechat', 'SERVER', 'You are online now !', new Date());*/
            /*getChatHistory(blockID, function(history) {
                io.sockets.in(blockID).emit('updatechat', history);
                socket.broadcast.to(blockID).emit('updatechat', history);
            });
          *
        });
        // when the client emits 'sendchat', this listens and executes
        socket.on('sendchat', function(data, block_id ) {
            // we tell the client to execute 'updatechat' with 4 parameters
            //addChatInDatabase(data, userName, user_id, block_id, message_by, function(history) {
                console.log(data);
                io.sockets.in(block_id).emit('updatechat', data);
                socket.broadcast.to(block_id).emit('updatechat', data);
            });
        })
        // when the user disconnects.. perform this
        socket.on('disconnect', function() {
            // remove the username from global usernames list
            //delete usernames[socket.username];
            socket.leave(socket.room);
        });
*/
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
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(res.end('Only images are allowed'), null)
      }
      callback(null, true)
    }
  }).single('userFile');
  upload(req, res, function(err) {
    res.end('File is uploaded')
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

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
