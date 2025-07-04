import jwt from "jsonwebtoken"

//user authentication middleware
const authUser = async (req,res,next)=>{
    try {
        const {token}=req.headers //atoken = admin token
        if(!token){
            return res.json({success:false,message:'Not Authorized Login Again'})
        }
        const token_decode=jwt.verify(token,process.env.JWT_SECRET)
        req.userId = token_decode.id
       
        next()
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}
export default authUser

// // ❌ Bad
// authUser middleware → req.body.userId = token_decode.id  
// updateProfile → const { userId } = req.body
// js
// Copy
// Edit
// // ✅ Good
// authUser middleware → req.userId = token_decode.id  
// updateProfile → const userId = req.userId