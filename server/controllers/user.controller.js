import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/veryfyEmailTemplate.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import generatedRefreshToken from '../utils/generateRefreshToken.js'
import uploadImageClodinary from '../utils/uploadImageCloudnary.js'
import generatedOtp from '../utils/generatedOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import jwt from 'jsonwebtoken'

//register controller

export async function registerUserController(request,response) {
    try {
        const {name, email,password}=request.body

        if(!name || !email || !password){
            return response.status(400).json({
                message : "provide email,name,password",
                error : true,
                success : false
            })
        }

        const user=await UserModel.findOne({email})

        if(user){
            return response.json({
                message : "Already register email",
                error : true,
                success: false
            })
        }

        const salt=await bcryptjs.genSalt(10)
        const hashPassword=await bcryptjs.hash(password,salt)

        const payload ={
            name,
            email,
            password: hashPassword
        }

        const newUser=new UserModel(payload)
        const save=await newUser.save()

        const verifyEmailUrl=`${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`


        const verifyEmail=await sendEmail({
            sendTo : email,
            subject: "Verify email from blinkit",
            html : verifyEmailTemplate({
                name,
                url: verifyEmailUrl
            })
        })

        return response.json({
            message : "User register successfully",
            error : false,
            success : true,
            data : save
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
        
    }    
}

//verify user email controller

export async function verifyEmailController(request,response) {
    try {
        const {code}=request.body

        const user=await UserModel.findOne({_id : code})

        if(!user){
            return response.status(400).json({
                message: "Invalid code",
                error : true,
                success : false
            })
        }

        const updateUser=await UserModel.updateOne({_id :code},{
            verify_email: true
        })

        return response.json({
            message : "Verify email done",
            success : true,
            error : false
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : true
        })
    }
    
}

//login controller

export async function loginController(request,response) {
    try {
        const {email,password}=request.body

        if(!email || !password){
            return response.status(400).json({
                message : " provide email and password",
                error : true,
                success : false
            })
        }

        const user=await UserModel.findOne({email})

        if(!user){
            return response.status(400).json({
                message : "User not register",
                error: true,
                success : false
            })
        }
        
        if(user.status !=="Active"){
            return response.status(400).json({
                message : "connect to admin",
                error : true,
                success : false
            })
        } 

        //decrypt the password and match or not
         
        const checkPassword=await bcryptjs.compare(password,user.password)

        if(!checkPassword){
            return response.status(400).json({
                message : "Check your password",
                error: true,
                success : false
            })
        }
         
        const accesstoken=await generatedAccessToken(user._id)
        const refreshtoken=await generatedRefreshToken(user._id)

        const updateUser=await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date :new Date()
        })


        const cookiesOption={
            httpOnly: true,
            secure : true,
            samesite : "None"
        }

        response.cookie('accesstoken',accesstoken,cookiesOption)
        response.cookie('refreshtoken',refreshtoken,cookiesOption)

        return response.json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshtoken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
        
    }
    
}

//logout controller

 
export async function logoutController(request,response) {
    try {

        const userId=request.userId //comming from the middileware

        const cookiesOption={
            httpOnly: true,
            secure : true,
            samesite : "None"
        }
        response.clearCookie("accesstoken",cookiesOption)
        response.clearCookie("refreshtoken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId,{
            refresh_token: ""
        })

        return response.json({
            message : "Logout successfully",
            error : false,
            success : true
        })

        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
    
}

//clodinary storeage for upload user avtar
export async function uploadAvtar(request,response) {
    try {
        const userId = request.userId // auth middlware
        const image = request.file  // multer middleware


        const upload=await uploadImageClodinary(image)
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        })

        return response.json({
            message : "upload profile",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update user profile

export async function updateUserDetails(request,response) {
    try {
        const userId=request.userId //auth middileware
        const {name,email,password,mobile}=request.body

        let hashPassword=""

        if(password){
            const salt=await bcryptjs.genSalt(10)
            hashPassword=await bcryptjs.hash(password,salt)
        }

        const updateUser=await UserModel.updateOne({_id :userId},{
            ...(name && {name :name}),
            ...(email && {email :email}),
            ...(mobile && {mobile :mobile}),
            ...(password && {password :hashPassword})

        })

        return response.json({
            message : "Update Successfully",
            error : false,
            success : true,
            data :updateUser
        })

        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
    
}

//forgot password not login
export async function forgotPasswordController(request,response) {
    try {
        const {email}=request.body

        const user=await UserModel.findOne({email})

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const otp=generatedOtp()
        const expireTime=new Date() + 60* 60 *1000 // 1hr

        const update=await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo : email,
            subject : "forget password from grocery",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })

        })

        return response.json({
            message : "check your email",
            error : false,
            success : true
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
    
}


//verify forgot password opt
export async function verifyForgotPasswordOtp(request,response) {
    try {
        const {email,otp}=request.body

        if(!email || !otp){
            return response.status(400).json({
                message : "please provide email and otp",
                error : true,
                success : false
            })
        }

        const user=await UserModel.findOne({email})

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const currentTime=new Date().toISOString()

        if(user.forgot_password_expiry<currentTime){
            return response.status(400).json({
                message: "Otp is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false 
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser=await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })
         
        return response.json({
            message : "Verify otp successfully",
            error : false,
            success : true
        })

        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
    
}

//reset the password
export async function resetPassword(request,response) {
    try {
        const {email,newPassword,confirmPassword}=request.body

        if(!email || !newPassword || !confirmPassword){
            return response.status(400).json({
                message : "provide required email,newPassword,confirmPassword",

            })
        }

        const user=await UserModel.findOne({email})

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message : "newPassword and confirmPassword are not same",
                error : true,
                success: false
            })
        }

        const salt=await bcryptjs.genSalt(10)
        const hashPassword=await bcryptjs.hash(newPassword,salt)

        const update=await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return response.json({
            message : "password update successfully",
            error : false,
            success : true

        })


        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//refresh token controller

export async function refreshToken(request,response) {
    try {
        const refreshToken=request.cookies.refreshtoken || request?.headers?.authorization?.split("")[1]

        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid token",
                error : true,
                success : false
            })
        }

        const verifyToken=await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return response.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId=verifyToken?._id

        const newAccessToken=await generatedAccessToken(userId)

        const cookiesOption={
            httpOnly: true,
            secure : true,
            samesite : "None"
        }

        response.cookie("accesstoken",newAccessToken,cookiesOption)
        
        return response.json({
            message : "New Access token generate",
            error : false,
            success : true,
            data : {
                accesstoken : newAccessToken
            }
        })

        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
    
}

//get login details controller
export async function userDetails(request,response) {
    try {
        const userId=request.userId
        

        const user=await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        }) 
    }
    
}
