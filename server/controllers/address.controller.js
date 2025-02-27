import AddressModel from '../models/address.model.js'
import UserModel from '../models/user.model.js'


export const addressController=async(request,response)=>{
try {
    console.log("Request received:", request.body);
    const userId = request.userId //middleware
    
    const {address_line,city,state,pincode,country,mobile}=request.body

    const createAddress=new AddressModel({
        address_line,
        city,
        state,
        country,
        pincode,
        mobile
    })

    const saveAddress=await createAddress.save()

    const addUserAddressId=await UserModel.findByIdAndUpdate(userId,{
        $push : {
            address_details : saveAddress._id
        }
    })

    return response.json({
        message : "AddressCreated Successfully",
        error : false,
        success: true,
        data: saveAddress
    })


    
} catch (error) {
    return response.status(500).json({
        message : error.message || error,
        error : true,
        success : false
    })
}
}

