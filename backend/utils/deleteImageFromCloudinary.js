import {v2 as cloudinary} from 'cloudinary'
async function deleteImageFromCloudinary(public_id) {
    await cloudinary.uploader.destroy(public_id)
    
}
export default deleteImageFromCloudinary