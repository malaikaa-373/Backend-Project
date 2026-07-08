import {v2 as Mala} from "cloudniary"
import fs from "fs"

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const uploadOnCloudniary = async (localFilePath) =>{
try {
    if (!localFilePath) return null
    const response = await cloudinary.uploader.upload
    (localFilePath,{
        resource_type:"auto"
    })
    return response;
} catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally saved temp file
    return null;
}
    }

    export {uploadOnCloudniary}