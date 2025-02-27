import {Router} from "express";
import auth from "../middleware/auth.js";
import { addressController } from "../controllers/address.controller.js";



const addressRouter=Router()

addressRouter.post('/create',auth,addressController)

export default addressRouter