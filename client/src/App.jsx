import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { useDispatch } from 'react-redux';
import SummaryApi from './common/SummaryApi';
import { setAllCategory,setAllSubCategory,setLoadingCategory } from './store/productSlice';
import Axios from './utils/Axios';
import { handleAddItemCart } from './store/cartProduct';
import GlobalProvider from './provider/GlobalProvider';
import CartMobile from './components/CartMobile';


function App() {

  const dispatch = useDispatch()
  const location=useLocation()

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({
        ...SummaryApi.getCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data.sort((a,b)=>a.name.localeCompare(b.name))))
        // setCategoryData(responseData.data)
      }


    } catch (error) {

    } finally {
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory
      })

      const { data: responseData } = response
      

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data.sort((a,b)=>a.name.localeCompare(b.name))))
        // setCategoryData(responseData.data)
      }
      


    } catch (error) {

    } finally {
    }
  }

  


  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
    // fetchCartItem()
  }, [])

 
  

  return (
    <GlobalProvider>
      <Header />
      <main className='min-h-[76vh]' >
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {
        location.pathname=== '/checkout' && (
          <CartMobile/>
        )
      }
      
    </GlobalProvider>


  )
}

export default App
