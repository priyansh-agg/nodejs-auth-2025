const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {
    try{
        const result = await cloudinary.uploader.upload(filePath);

        return {
            url: result.secure_url,
            publicId: result.public_id
        }
    }
    catch(error){
        console.error("Error uploading file",e);
        throw new Error("Error uploading file");
    }
    
}

module.exports = {uploadToCloudinary}