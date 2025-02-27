import { createContext, useContext, useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError"
import toast from "react-hot-toast";
import { priceWithDiscount } from "../utils/PriceWithDiscount";

const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0)
  const [notDiscountTotalPrice,setNotDiscountTotalPrice]=useState(0)
  const [totalQty, setTotalQty] = useState(0)
  const cartItem = useSelector(state => state.cartItem.cart)
  const user=useSelector(state=>state.user)


  const fetchCartItem = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));

      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const updateCartItem = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: {
          _id: id,
          qty: qty

        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        // toast.success(responseData.message)
        fetchCartItem()
        return responseData
      }

    } catch (error) {

      AxiosToastError(error)
      return error
    }
  }

  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: {
          _id: cartId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchCartItem()
      }

    } catch (error) {
      AxiosToastError(error)

    }
  }

  // useEffect(() => {
  //   fetchCartItem();

  // }, [fetchCartItem]); // Including fetchCartItem in dependencies

  useEffect(() => {
    const qty = cartItem.reduce((preve, curr) => {
      return preve + curr.quantity
    }, 0)
    setTotalQty(qty)

    const tPrice = cartItem.reduce((preve, curr) => {
      const priceAfterDiscount = priceWithDiscount(curr?.productId?.price,
        curr?.productId?.discount
      )

      return preve + (priceAfterDiscount * curr.quantity)
    }, 0)
    setTotalPrice(tPrice)

    const notDiscountPrice = cartItem.reduce((preve, curr) => {

      return preve + (curr?.productId?.price * curr.quantity)
    }, 0)
    setNotDiscountTotalPrice(notDiscountPrice)

  }, [cartItem])

  const handleLogout=()=>{
    localStorage.clear()
    dispatch(handleAddItemCart([]))
  }

  useEffect(()=>{
    fetchCartItem()
    handleLogout()

  },[user])

  return (
    <GlobalContext.Provider value={{ fetchCartItem, updateCartItem, deleteCartItem, totalPrice, totalQty,notDiscountTotalPrice }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
