import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";


const changeAvailability=async(req,res)=>{
    try {
        const {docId}=req.body
        const docData =await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:'Availability Changed'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const doctorList =async(req,res) =>{
    try {

        const doctors=await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

//API for doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API to get doctorsappointment
const appointmentsDoctor =async (req,res)=>{
  try {
    const docId=req.docId
    const appointments=await appointmentModel.find({docId})
    res.json({success:true,appointments})
  } catch (error) {
      console.log(error);
    res.json({ success: false, message: error.message });
  }
}
//API to mark appointment completed for doctor panel
const appointmentComplete=async(req,res)=>{
  try {
    const docId=req.docId
     const {appointmentId}=req.body
    const appointmentData=await appointmentModel.findById(appointmentId)
    if(appointmentData && appointmentData.docId===docId){
      await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
      return res.json({success:true,message:'Appointment Completed'})
    }
    else{
      return res.json({success:false,message:'Mark Failed'})
    }
    
  } catch (error) {
     console.log(error);
    res.json({ success: false, message: error.message });
  }
}
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
      // 1. Mark the appointment as cancelled
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

      // 2. Remove slot from doctor's booked slots
      const doctor = await doctorModel.findById(docId);
      const slotDate = appointmentData.slotDate;
      const slotTime = appointmentData.slotTime;

      if (doctor?.slots_booked?.[slotDate]) {
        doctor.slots_booked[slotDate] = doctor.slots_booked[slotDate].filter(
          (time) => time !== slotTime
        );

        // Optional: Clean up if no slots left on that date
        if (doctor.slots_booked[slotDate].length === 0) {
          delete doctor.slots_booked[slotDate];
        }

        await doctor.save();
      }

      return res.json({ success: true, message: "Appointment Cancelled and slot freed" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed: Unauthorized or Invalid ID" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get dashboard data for doctor panel
const doctorDashboard =async(req,res)=>{
  try {
    const docId=req.docId
    const appoinments =await appointmentModel.find({docId})
    let earnings=0;
    appoinments.map((item)=>{
      if(item.isCompleted || item.payment){
        earnings+=item.amount
      }
    })
    let patients=[]
    appoinments.map((item)=>{
      if(!patients.includes(item.userId)){
        patients.push(item.userId)
      }
    })
    const dashData={
      earnings,
      appointments:appoinments.length,
      patients:patients.length,
      latestAppointments:appoinments.reverse().slice(0,5)
    }
    res.json({success:true,dashData})
  } catch (error) {
     console.log(error);
    res.json({ success: false, message: error.message });
  }
}
//API to get doctor profile fro doctor panel
const doctorProfile = async (req,res)=>{
  try {
    const docId=req.docId
    const profileData=await doctorModel.findById(docId).select('-password')
    res.json({success:true,profileData})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
//API to update the doctor profile datafrom doctor panel
const updateDoctorProfile=async(req,res)=>{
  try {
    const docId=req.docId
    const {fees,address,available}=req.body
    await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
    res.json({success:true,message:'Profile Updated'})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
export {changeAvailability,doctorList,loginDoctor,appointmentsDoctor,appointmentCancel,appointmentComplete
  ,doctorDashboard,doctorProfile,updateDoctorProfile}