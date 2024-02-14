import { useContext, useState } from "react"
import UserContext from "../context/userContext"
import useSignout from "./useSignout"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const useFetch = (method:"GET"| "POST" | "PUT" | "DELETE" | "PATCH") => {
    const [data,setData] = useState()
    const [error,setError]=useState('')
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const {setUser} = useContext(UserContext)

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
            setError(e?.message || "Something went wrong")

            if(e) {

                if(e.message?.includes("jwt expired")) {
                    toast.error("Your session has expired")
                    localStorage.clear()
                    setUser({isAuthenticated:false,user:null})
                    navigate("/")

                }
            }
          

        }
    }

    return {data,error,loading,fetchData}

}

export default useFetch