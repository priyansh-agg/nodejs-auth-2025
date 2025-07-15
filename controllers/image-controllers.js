const Image = require('../models/Image');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper')
const fs = require('fs');
const cloudinary = require('../config/cloudinary')

const uploadImageController = async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "File is required. Upload image"
            });
        }
        const {url,publicId} = await uploadToCloudinary(req.file.path);

        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedby: req.userInfo.userId
        })
        await newlyUploadedImage.save();

        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: 'Image upload successfully',
            image: newlyUploadedImage
        })
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong Try again"
        })
    }
}

const imageFetchController = async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1:-1

        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        if(images){
            res.status(200).json({
                success: true,
                message: 'images fetched successfully',
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images,
            })
        }
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong Try again"
        })
    }
}

const deleteImageController = async(req,res)=>{
    try{
        const getTargetImage = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getTargetImage);

        if(!image){
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            })
        }
        //check if this image is uploaded by user who is deleting the image
        if(image.uploadedby.toString() !== userId){
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this image'
            })
        }
        //delete this image from cloudinary
        await cloudinary.uploader.destroy(image.publicId)

        //delete from mongodb
        await Image.findByIdAndDelete(getTargetImage);

        res.status(200).json({
            sucess: true,
            message: "image deleted sucessfully"
        })
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong Try again"
        })
    }
}
module.exports = {uploadImageController,imageFetchController,deleteImageController};