import { useState } from "react"

const useFetch = (method:"GET"| "POST" | "PUT") => {
    const [data,setData] = useState()
    const [error,setError]=useState('')
    const [loading,setLoading] = useState(false)

    const fetchData=async(url:string,formData?:any,noType?:boolean) => {
        try{
            setLoading(true)
            const res = await fetch(url,{
                method,
                headers:{
                   ...(noType ? {} :  {"Content-Type": "application/json"})
    
                },
                ...(formData && {body: noType ? formData : JSON.stringify(formData)})
            })
            if(res.status===500) throw new Error("Internal Server Error")
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