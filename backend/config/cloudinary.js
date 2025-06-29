import { v2 as cloudinary } from "cloudinary"; //importing v2 which is version2 and naming it as cloudinary for clear and clean code 


const connectCloudinary = async () => { //this is a function to connect to cludinary 
  cloudinary.config({ // this is a cloudinary method or function which allows u to provide a name,apikey,secret key (which was given to you when you were created acc in cludinary web as a client ) 
    //so it uses a given credential and verifies 
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};
export default connectCloudinary;
