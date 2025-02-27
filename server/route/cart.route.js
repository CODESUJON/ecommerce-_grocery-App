import {Router} from "express";
import auth from "../middleware/auth.js";
import { addCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemController } from "../controllers/cart.controller.js";

const cartRouter=Router()

cartRouter.post('/create',auth,addCartItemController)
cartRouter.get('/get',auth,getCartItemController)
cartRouter.put('/update-qty',auth,updateCartItemController)
cartRouter.delete('/delete-qty',auth,deleteCartItemQtyController)

export default cartRouter