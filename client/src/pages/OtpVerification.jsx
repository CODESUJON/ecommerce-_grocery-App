
import React, { useEffect, useRef, useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast'
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";


function OtpVerification() {
  const [data, setDate] = useState(["", "", "", "", "", ""]);
  const inputRef=useRef([])
  const navigate = useNavigate()
  const location=useLocation()

  useEffect(()=>{
    if(!location?.state?.email){
      navigate("/forgot-password")
    }
  })


  const valideValue = data.every(el => el)

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      const response = await Axios({
        ...SummaryApi.otp_verification,
        data: {
          otp : data.join(""),
          email : location?.state?.email
        }
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        setDate(["", "", "", "", "", ""])
        navigate("/reset-password",{
          state : {
            data :response.data,
            email : location?.state?.email
          }
        })
      }

      console.log("response", response)

    } catch (error) {
      AxiosToastError(error)
    }




  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-3">
        <p className="font-semibold text-lg">Enter Otp</p>

        <form className="grid gap-4 mt-2" onSubmit={handleSubmit}>

          <div className="grid gap-1">
            <label htmlFor="otp">Enter Your OTP:</label>
            <div className="flex items-center gap-2 justify-between mt-3">
              {
                data.map((element, index) => {
                  return (
                    <input
                    key={"otp"+index}
                      type="text"
                      id="otp"
                      ref={(ref)=>{
                        inputRef.current[index]=ref
                        return ref
                      }}
                      value={data[index]}
                      onChange={(e)=>{
                        const value=e.target.value
                        console.log("value",value)

                        const newData=[...data]
                        newData[index]=value
                        setDate(newData)

                        if(value && index <5){
                          inputRef.current[index+1].focus()
                        }
                      }}
                      maxLength={1}
                      className="bg-blue-50 p-2 w-full max-w-16 border rounded outline-none focus:border-primary-200 text-center font-semibold"

                    />
                  )
                })
              }
            </div>

          </div>

          <button disabled={!valideValue} className={` ${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>Verify Otp</button>
        </form>

        <p>
          Already have account ? <Link to={"/login"} className="font-semibold text-green-700 hover:text-green-800" >Login</Link>
        </p>
      </div>
    </section>
  );
}

export default OtpVerification;
