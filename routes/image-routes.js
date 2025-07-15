const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');
const {uploadImageController,imageFetchController,deleteImageController} = require('../controllers/image-controllers');



const router = express.Router();


router.post('/upload',authMiddleware,adminMiddleware,uploadMiddleware.single('image'),uploadImageController) 

router.get('/getimages',authMiddleware,imageFetchController);

router.delete('/delete/:id',authMiddleware,adminMiddleware,deleteImageController);



module.exports = router;
// 68750113649c28b89f4a6dd1