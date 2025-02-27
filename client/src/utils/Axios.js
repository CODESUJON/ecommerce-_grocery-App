import axios from "axios";
import SummaryApi, { baseUrl } from "../common/SummaryApi";

const Axios=axios.create({
    baseURL : baseUrl,
    withCredentials : true
})

//custom axios
//sending accesstoken in the header
Axios.interceptors.request.use(
    async(config)=>{
        const accessToken=localStorage.getItem('accesstoken')

        if(accessToken){
            config.headers.authorization=`Bearer ${accessToken}`
        }

        return config

    },
    (error)=>{
        return Promise.reject(error)
    }
)


//extend the life  span of access token with the help of refresh 
Axios.interceptors.request.use(
    (response)=>{
        return response
    },
    async(error)=>{
        let originRequest=error.config

        if(error.response.status==401 && !originRequest.retry){
            originRequest.retry=true

            const refreshToken=localStorage.getItem('refreshtoken')

            if(refreshToken){
                const newAccessToken=await refreshAccessToken(refreshToken)

                if(newAccessToken){
                    originRequest.headers.Authorization=`Bearer ${newAccessToken}`
                    return Axios(originRequest)
                }
            }
        }

        return Promise.reject(error)
    }
)

const refreshAccessToken=async(refreshToken)=>{
    try {
        const response=await Axios({
            ...SummaryApi.refreshToken,
        headers : {
            Authorization : `Bearer ${refreshToken}`


        }
        })
        
        const accessToken=response.data.data.accessToken
        localStorage.getItem('accesstoken',accessToken)
        return accessToken
    } catch (error) {
        console.log(error)
    }
}



export default Axios