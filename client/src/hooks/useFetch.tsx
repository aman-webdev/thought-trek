import { useState } from "react"

const useFetch = (method:"GET"| "POST") => {
    const [data,setData] = useState()
    const [error,setError]=useState('')
    const [loading,setLoading] = useState(false)

    const fetchData=async(url:string,formData?:any) => {
        console.log(method,'ttt')
        try{
            setLoading(true)
            const res = await fetch(url,{
                method,
                headers:{
                    "Content-Type": "application/json",
    
                },
                ...(formData && {body:JSON.stringify(formData)})
            })
    
            const response = await res.json()
            if(!res.ok) throw new Error(response.message || 'Internal Server Error') 
            setData(response)
            setLoading(false)
        } catch(e:any){
            setLoading(false)
            throw new Error(e.message)
        }
    }

    return {data,error,loading,fetchData}

}

export default useFetch