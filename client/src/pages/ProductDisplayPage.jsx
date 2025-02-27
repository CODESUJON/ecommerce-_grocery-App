import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceRupees'
import Divider from '../components/Divider'
import image1 from '../assets/superfast.png'
import image2 from '../assets/offer.png'
import image3 from '../assets/wide.png'
import { priceWithDiscount } from '../utils/PriceWithDiscount.js'
import AddToButton from '../components/AddToButton.jsx';

const fetchProductDetails = async (productId) => {
  const res = await Axios({
    ...SummaryApi.getProductDetails,
    data: {
      productId: productId
    }
  })

  return await res.data

}

function ProductDisplayPage() {
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: "",
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()
  const { product } = useParams()

  let productId = product?.split("-").slice(-1)[0]

  useEffect(() => {
    try {
      const getData = async () => {
        const res = await fetchProductDetails(productId)
        setProductDetails(prev => ({
          ...prev,
          _id: res.data._id,
          name: res.data.name,
          image: [...res.data.image],
          unit: res.data.unit,
          stock: res.data.stock,
          price: res.data.price,
          discount: res.data.discount,
          description: res.data.description,
          more_details: res.data.more_details,
        }))
      }
      getData()

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }, [productId])

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100

  }

  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2'>
      <div>
        <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
          <img src={productDetails.image[image]} className='w-full h-full object-scale-down' />
        </div>
        <div className='flex items-center justify-center gap-3 my-2'>
          {
            productDetails.image.map((img, index) => {
              return (
                <div key={img + index + "point"} className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-300"}`}></div>
              )
            })
          }
        </div>
        <div className='grid relative'>
          <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
            {
              productDetails.image.map((img, index) => {
                return (
                  <div className='w-20 h-20 min-h-20 min-w-20 scr cursor-pointer shadow-md' key={img + index}>
                    <img src={img} alt='min-product' onClick={() => setImage(index)} className='w-full h-full object-scale-down' />

                  </div>
                )
              })
            }
          </div>
          <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute  items-center'>
            <button onClick={handleScrollLeft} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
              <FaAngleLeft />
            </button>
            <button onClick={handleScrollRight} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
              <FaAngleRight />
            </button>
          </div>
        </div>
        <div>
        </div>

        <div className='my-4  hidden lg:grid gap-3 '>
          <div>
            <p className='font-semibold'>Description</p>
            <p className='text-base'>{productDetails.description}</p>
          </div>
          <div>
            <p className='font-semibold'>Unit</p>
            <p className='text-base'>{productDetails.unit}</p>
          </div>
          {
            productDetails?.more_details && Object.keys(productDetails?.more_details).map((element, index) => {
              return (
                <div>
                  <p className='font-semibold'>{element}</p>
                  <p className='text-base'>{productDetails?.more_details[element]}</p>
                </div>
              )
            })
          }
        </div>
      </div>

      <div className='p-4 lg:pl-7 text-base lg:text-lg'>
        <p className='bg-green-300 w-fit px-2 rounded-full'>10 Min</p>
        <h2 className='text-lg font-semibold lg:text-3xl'>{productDetails.name}</h2>
        <p className=''>{productDetails.unit}</p>
        <Divider />
        <div>
          <p>Price</p>
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
              <p className='font-semibold text-lg lg:text-xl'>{DisplayPriceInRupees(priceWithDiscount(productDetails.price, productDetails.discount))}</p>
            </div>
            {
              productDetails.discount && (
                <p className='line-through'>{DisplayPriceInRupees(productDetails.price)}</p>
              )
            }
            {
              productDetails.discount && (
                <p className='font-bold text-green-600 lg:text-2xl'>{productDetails.discount}%<span className='text-base text-neutral-500'>Discount</span></p>
              )
            }

          </div>
        </div>
        {
          productDetails.stock === 0 ? (
            <p className='text-lg text-red-500 my-2'>Out of Stock</p>
          )
            : (
              <div className='my-4'>
                <AddToButton data={productDetails} />

              </div>
            )
        }
        <h2 className='font-semibold'>Why shop from binkeyit? </h2>

        <div>
          <div className='flex  items-center gap-4 my-4'>
            <img
              src={image1}
              alt='superfast delivery'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Superfast Delivery</div>
              <p>Get your orer delivered to your doorstep at the earliest from dark stores near you.</p>
            </div>
          </div>
          <div className='flex  items-center gap-4 my-4'>
            <img
              src={image2}
              alt='Best prices offers'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Best Prices & Offers</div>
              <p>Best price destination with offers directly from the nanufacturers.</p>
            </div>
          </div>
          <div className='flex  items-center gap-4 my-4'>
            <img
              src={image3}
              alt='Wide Assortment'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Wide Assortment</div>
              <p>Choose from 5000+ products across food personal care, household & other categories.</p>
            </div>
          </div>
        </div>

        {/* only mobile */}
        <div className='my-4 grid gap-3 '>
          <div>
            <p className='font-semibold'>Description</p>
            <p className='text-base'>{productDetails.description}</p>
          </div>
          <div>
            <p className='font-semibold'>Unit</p>
            <p className='text-base'>{productDetails.unit}</p>
          </div>
          {
            productDetails?.more_details && Object.keys(productDetails?.more_details).map((element, index) => {
              return (
                <div>
                  <p className='font-semibold'>{element}</p>
                  <p className='text-base'>{productDetails?.more_details[element]}</p>
                </div>
              )
            })
          }
        </div>
      </div>


    </section>
  )
}

export default ProductDisplayPage