import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { LuExternalLink } from "react-icons/lu";
import isAdmin from '../utils/isAdmin'


function UserMenu({ close }) {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })

      if (response.data.success) {
        if (close) {
          close() //props use
        }

        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message)
        navigate("/")
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleClose = () => {
    if (close) {
      close()
    }
  }
  return (
    <div>
      <div className='font-semibold'>My Account</div>
      <div className='text-sm flex items-center gap-2'>
        <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} <span className=' font-medium text-red-500'>{user.role=== "ADMIN" ? "(Admin)" : ""}</span> </span>
        <Link onClick={handleClose} className='hover:text-primary-200' to={"/dashboard/profile"}
        ><LuExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      <div className='text-sm grid gap-2'>
        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/category"} className='px-2 hover:bg-orange-200'>Category</Link>

          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/subcategory"} className='px-2 hover:bg-orange-200'>Sub Category</Link>

          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/upload-product"} className='px-2 hover:bg-orange-200'>Upload Product</Link>

          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/product"} className='px-2 hover:bg-orange-200'>Product</Link>

          )
        }




        <Link onClick={handleClose} to={"/dashboard/myorders"} className='px-2 hover:bg-orange-200'>My Orders</Link>
        <Link onClick={handleClose} to={"/dashboard/address"} className='px-2 hover:bg-orange-200'>Save Address</Link>
        <button onClick={handleLogout} className='text-left px-2 hover:bg-orange-200'>Log Out</button>
      </div>
    </div>
  )
}

export default UserMenu