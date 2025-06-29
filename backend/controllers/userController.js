import validator from 'validator'
import bcrypt from 'bcryptjs'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js'
import Razorpay from 'razorpay';


// api to register user
const registerUser =async(req,res)=>{

    try {

        const {name,email,password}=req.body

        // Check for missing details
        if(!name|| !email || !password){
            return res.json({success:false,message:"Missing Details"})
        }
        // Validate email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"invalid email"})
        }
        // Check password length (should be at least 8 characters)
        if(password<8){
            return res.json({success:false,message:"enter a strong password"})
        }

        //hashing password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        // Prepare user data for saving
        const userData={
            name,
            email,
            password:hashedPassword
        }
        // Create new user instance and save to DB
        const newUser = new userModel(userData)
        const user=await newUser.save()

        // Generate JWT token for the user
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token})

        
    } catch (error) {
        // Handle errors
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
/**
 * API for user login
 * Expects: { email, password } in req.body
 * Returns: { success, token } or error message
 */
const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body
        // Find user by email
        const user=await userModel.findOne({email})

        if(!user){
           return res.json({success:false,message:'user not found'})
        }
        // Compare provided password with stored hash
        const isMatch=await bcrypt.compare(password,user.password)
        if(isMatch){
            // Generate JWT token if password matches
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:'Invalid credentials'})
        }
    } catch (error) {
        // Handle errors
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

// API to get user profile data
const getProfile= async(req,res)=>{
    try {

        // const { userId } =req.body
         const userId = req.userId;
        // Find user by ID and exclude password field
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true,userData})
        
    } catch (error) {
        // Handle errors
          console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;  // ✅ coming from token, not body
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // Check required fields
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Data Missing' });
    }

    // Prepare update object
    const updateData = {
      name,
      phone,
      address: JSON.parse(address), // only if address is sent as stringified JSON
      dob,
      gender
    };

    // Upload image if available
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image'
      });
      updateData.image = imageUpload.secure_url;
    }

    // Update in DB
    const result = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    if (!result) {
      return res.json({ success: false, message: 'User not found or not updated' });
    }

    res.json({ success: true, message: 'Profile Updated', user: result });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book appointment
const bookAppointment =async (req,res)=>{
  try {
    const {docId,slotDate,slotTime}=req.body
    const userId = req.userId
    // console.log("Received docId from frontend:", docId);


    const docData=await doctorModel.findById(docId).select('-password')
    // console.log("Booking for docId:", docId, "slotDate:", slotDate, "slotTime:", slotTime);

    if(!docData.available){
      return res.json({success:false,message:'Doctor not available'})
    }
    let slots_booked=docData.slots_booked

    if(slots_booked[slotDate]){
      if(slots_booked[slotDate].includes(slotTime)){
       return res.json({success:false,message:'slot not available'})
       }else{  
        slots_booked[slotDate].push(slotTime)

      }
    }else{
      slots_booked[slotDate]=[]
      slots_booked[slotDate].push(slotTime)
    }
     const userData =await userModel.findById(userId).select('-password')

     delete docData.slots_booked

     const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount:docData.fees,
      slotTime,
      slotDate,
      date:Date.now()
     }

     const newAppointment =new appointmentModel(appointmentData)
     await newAppointment.save()

          //save new slots data in docData
          await doctorModel.findByIdAndUpdate(docId,{slots_booked})

          res.json({success:true,message:'Appiontment Booked'})



  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// API to get user appointment for frontend my-appointments page
const  listAppointment =async (req,res) =>{
  try {
    const userId=req.userId
    const appointments=await appointmentModel.find({userId})
    res.json({success:true,appointments})
  } catch (error) {
     console.log(error);
    res.json({ success: false, message: error.message });
  }
}
//API to cancel appointment 
const cancelAppointment=async(req,res)=>{
  try {
    const userId=req.userId;
    const {appointmentId}=req.body
    const  appointmentData =await appointmentModel.findById(appointmentId)

    if(appointmentData.userId !==userId){
      return res.json({success:false,message:'Unauthorized action'})
    }
    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
    //releasing doctor slot
    const{docId,slotDate,slotTime}=appointmentData

    const doctorData=await doctorModel.findById(docId)

    let slots_booked =doctorData.slots_booked

    slots_booked[slotDate] =slots_booked[slotDate].filter(e=>e!==slotTime)
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})

    res.json({success:true,message:'Appointment Cancelled'})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}




const markAppointmentPaid = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { payment: true, isCompleted: true },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    console.error("Error marking paid:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,markAppointmentPaid,cancelAppointment}