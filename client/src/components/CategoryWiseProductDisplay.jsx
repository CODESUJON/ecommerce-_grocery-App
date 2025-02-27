import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError.js'
import Axios from '../utils/Axios.js'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { validUrlConvert } from '../utils/validURLConvert.js'

function CategoryWiseProductDisplay({ id, name }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const SubCategoryData = useSelector(state => state.product.allSubCategory)
    // console.log("sub",SubCategoryData)


    const loadingCardNumber = new Array(6).fill(null)


    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })


            const { data: responseData } = response



            if (responseData.success) {
                setData(responseData.data)
            }


        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])



    const handleScrollLeft = () => {
        containerRef.current.scrollLeft += 200

    }

    const handleScrollRight = () => {
        containerRef.current.scrollLeft -= 200

    }

    const handleRedirectProductListpage = () => {
        if (!SubCategoryData || !Array.isArray(SubCategoryData)) {
            // console.error("SubCategoryData is not available or is not an array.");
            return "/";
        }
    
        const subcategory = SubCategoryData.find(sub => 
            sub.category.some(c => c._id === id)
        );
    
        if (!subcategory) {
            // console.error(`No subcategory found for category ID: ${id}`);
            return "/";
        }
    
        return `/${validUrlConvert(name)}-${id}/${validUrlConvert(subcategory?.name)}-${subcategory?._id}`;
    };
    

    const redirectUrl=handleRedirectProductListpage()




    return (
        <div>
            <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
                <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
                <Link to={redirectUrl} className='text-green-600 hover:text-green-400'>See All</Link>
            </div>
            <div className='relative flex items-center '>
                <div className=' flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth' ref={containerRef} >
                    {loading &&
                        loadingCardNumber.map((_, index) => {
                            return (
                                <CardLoading key={"CategorywiseProductDisplay123" + index} />
                            )
                        })
                    }
                    {
                        data.map((p, index) => {
                            return (
                                <CardProduct data={p} key={p._id + "CategorywiseProductDisplay" + index} />
                            )
                        })
                    }

                </div>
                <div className='w-full left-0 right-0 container mx-auto  px-2  absolute hidden lg:flex justify-between'>
                    <button onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full'>
                        <FaAngleLeft />
                    </button>
                    <button onClick={handleScrollRight} className='z-10 relative  bg-white hover:bg-gray-100 shadow-lg p-2 text-lg rounded-full'>
                        <FaAngleRight />
                    </button>
                </div>
            </div>


        </div>
    )
}

export default CategoryWiseProductDisplay