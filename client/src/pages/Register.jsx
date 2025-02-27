import React, { useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast'
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";


function Register() {
  const [data, setDate] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword,setShowPassword]=useState(false)
  const [showConfirmPassword,setShowConfirmPassword]=useState(false)
  const navigate=useNavigate()


  

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDate((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const valideValue=Object.values(data).every(el =>el)

  const handleSubmit =async (e) => {
    e.preventDefault(); // Prevent form submission

    if (data.password !== data.confirmPassword) {
      toast.error("Password and confirm password must be the same");
      return;
    }

    try {
      const response=await Axios({
        ...SummaryApi.register,
        data :data
      })

      if(response.data.error){
        toast.error(response.data.message)
      }

      if(response.data.success){
        toast.success(response.data.message)
        setDate({
          name : "",
          email : "",
          password : "",
          confirmPassword : ""
        })
        navigate("/login")
      }

      
    } catch (error) {
      AxiosToastError(error)
    }

    

    
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-3">
        <p>Welcome to grocery</p>

        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              autoFocus
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              value={data.name}
              placeholder="Enter your name"
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              value={data.email}
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="password">Password:</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="w-full outline-none"
                value={data.password}
                placeholder="Enter your password"
                onChange={handleChange}
              />
              <div onClick={()=> setShowPassword(preve => ! preve)} className="cursor-pointer">
                {
                    showPassword ? (
                        <FaRegEye />
                    ) : (
                        <FaEyeSlash />
                    )
                }
                
              </div>
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="confirmPassword">confirm Password:</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                className="w-full outline-none"
                value={data.confirmPassword}
                placeholder="Enter your confirm password"
                onChange={handleChange}
              />
              <div onClick={()=> setShowConfirmPassword(preve => ! preve)} className="cursor-pointer">
                {
                    showConfirmPassword ? (
                        <FaRegEye />
                    ) : (
                        <FaEyeSlash />
                    )
                }
                
              </div>
            </div>
          </div>

          <button disabled={!valideValue} className={` ${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>Register</button>
        </form>

        <p>
          Already have account ? <Link to={"/login"} className="font-semibold text-green-700 hover:text-green-800" >Login</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
