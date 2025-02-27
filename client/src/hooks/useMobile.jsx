import React ,{ useState, useEffect } from 'react'

const useMobile=(breakPoint=768)=>{
    const [isMobile,setIsMobile]=useState(window.innerWidth<breakPoint)

    const handleResize=()=>{
        const checkpoint=window.innerWidth<breakPoint
        setIsMobile(checkpoint)
    }

    useEffect(()=>{
        handleResize()

        window.addEventListener('resize',handleResize)

        return()=>{
            window.removeEventListener('resize',handleResize)
        }
    },[])
    return [isMobile]
}

export default useMobile