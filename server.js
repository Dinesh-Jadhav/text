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
//routes
var users = require('./service/users');

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(session({secret: 'secret',saveUninitialized: true,resave: true}));
// =================================================================
// configuration ===================================================
// =================================================================

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database, function(err,database) {
    if(err) {
        console.error(err);
     }
    db = database; 
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
app.post('/login',function(req,res){
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
    });

app.get('/logout',function(req, res) {
  req.session = "";
  result = {};
  result.error = false;
  result.data = "Log out successfully";
  res.send(JSON.stringify(result));
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

apiRoutes.get('/users',users.getallusers());
apiRoutes.get('/users/:id',users.getuserdetails(ObjectId));
apiRoutes.post('/user',users.addnewusers(crypto));
apiRoutes.delete('/user/:id',users.deleteuser(ObjectId));
apiRoutes.put('/users/:id',users.getuserdetails(ObjectId));
//apiRoutes.post('/upload',users.uploadprofile(multer));


// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
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
