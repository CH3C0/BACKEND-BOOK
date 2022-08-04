import cloudinary from 'cloudinary'
import fs from 'fs'
import StatusCodes from 'http-status-codes'

const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;

cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: CLOUD_API_KEY, 
    api_secret: CLOUD_API_SECRET
  });

const uploadSingleHandler = async (req, res) => {

    const {file} = req;

    try {
        
        const result = await cloudinary.uploader.upload(file.path);
        res.status(StatusCodes.OK).json(result.public_id)
    } catch (error) {
        console.log("🚀 ~ uploadSingleHandler ~ error", error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        
    } finally {
        fs.unlinkSync(file.path);
    }
}

export default uploadSingleHandler;