const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req,res,cb){
        cb(null,'uploads/')
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        )
    }
})

//file filter function
const checkFileFilter = (req,file,cb) =>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }
    else{
        cb(new Error('Not an image! Please upload an image'));
    }
}

//multer middleware
module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        filesize: 5*1024*1024 //5MB limit
    }
})

