
/*
exports.upload = function(multer,path){
  var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, './public/images')
    },
    filename: function(req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
  
return function(req, res) {
    var upload = multer({
      storage: storage,
      fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname);
        console.log(ext);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
          return callback(res.end('Only images are allowed'), null)
        }
        callback(null, true)
      }
    }).single('userFile');
    upload(req, res, function(err) {
      res.end('File is uploaded')
    })
   }
}*/