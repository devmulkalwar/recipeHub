import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload function
export const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    
    // Verify file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    // Upload with optimized settings
    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(filePath, {
        resource_type: "auto",
        folder: "recipe-hub/profiles",
        transformation: [
          { width: 400, height: 400, crop: "limit" },
          { quality: "auto:low", fetch_format: "auto" }
        ],
        chunk_size: 6000000,
        timeout: 60000,
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    const result = await Promise.race([
      uploadPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout')), 60000)
      )
    ]);

    return result;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};

// Delete function
const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return null;

    // Extract public_id from the URL
    const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw new Error('Failed to delete image from cloudinary');
  }
};

// Export functions
export { deleteImageFromCloudinary };