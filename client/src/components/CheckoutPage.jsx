import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceRupees'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import {useNavigate } from 'react-router-dom'
import AddAddress from './AddAddress'


function CheckoutPage() {
        const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
        const [openAddress, setOpenAddress] = useState(false)
    
    return (
        <section className='bg-blue-50'>
            <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
                <div className='w-full'>
                    {/* address */}
                    <h3 className='text-lg font-semibold'>Choose your address</h3>
                    <div className='bg-white p-2 grid gap-4 '>

                        <div onClick={()=>setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
                            Add address
                        </div>

                    </div>

                    <div className='w-full max-w-md bg-white py-4 px-2'>
                        {/*summary  */}
                        <h3 className='text-lg font-semibold'>Summary</h3>
                        <div className='bg-white p-4'>
                            <h3 className='font-semibold'>Bill details</h3>
                            <div className='flex gap-4 justify-between ml-1'>
                                <p>Items total</p>
                                <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
                            </div>
                            <div className='flex gap-4 justify-between ml-1'>
                                <p>Quntity total</p>
                                <p className='flex items-center gap-2'>{totalQty} item</p>
                            </div>
                            <div className='flex gap-4 justify-between ml-1'>
                                <p>Delivery Charge</p>
                                <p className='flex items-center gap-2'>Free</p>
                            </div>
                            <div className='font-semibold flex items-center justify-between gap-4'>
                                <p >Grand total</p>
                                <p>{DisplayPriceInRupees(totalPrice)}</p>
                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-4'>
                            <button className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold' >Online Payment</button>

                            <button className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white' >Cash on Delivery</button>
                        </div>
                    </div>
                </div>

            </div>

            {
                openAddress && (
                    <AddAddress close={()=>setOpenAddress(false)}/>
                )
            }
        </section>
    )
}

export default CheckoutPage