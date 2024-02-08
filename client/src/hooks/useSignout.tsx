import { useContext, useEffect } from "react"
import UserContext from "../context/userContext"
import useFetch from "./useFetch"
import { useNavigate } from "react-router-dom"

const useSignout=()=>{
    const {setUser} = useContext(UserContext)
    
    const {data,error,fetchData,loading} = useFetch("POST")
    const navigate = useNavigate()

    const signoutUser=async()=>{

        try{
            await fetchData("/api/user/signout")

        }catch(err:any){
            throw new Error(err)
        }
    }

    useEffect(()=>{
        if(!data) return;
        localStorage.clear()
        setUser({isAuthenticated:false,user:null})
        navigate("/sign-in")
    },[data])


    return {data,error,loading,signoutUser}
}

export default useSignout