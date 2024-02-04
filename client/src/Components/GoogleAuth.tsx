import React, { useContext, useEffect } from "react";
import { Button } from ".";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import useFetch from "../hooks/useFetch";
import toast from "react-hot-toast";
import UserContext from "../context/userContext";
import { useNavigate } from "react-router-dom";

const GoogleLogo = ({ className }: { className?: string }) => (
  <svg
    className={`w-6 h-6 ${className || ""}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z"></path>
  </svg>
);

const GoogleAuth = () => {
  const { data, error, loading, fetchData } = useFetch("POST");
  const {setUser} = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(()=>{
    if(error) {
      toast.error(error)
      return;
    }  

    if(data) {
      const {message,data:userData} = data;
      toast.success(message)
      setUser({isAuthenticated:true,user:userData})
      navigate("/")

    }
  },[data,error])




  return (
    <div className="w-full mt-2 flex items-center justify-center">
    
    <GoogleLogin
      useOneTap
      size="medium"
      theme="outline"
      shape="circle"
      width={'100%'}
      text="continue_with"
      onSuccess={async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
          toast.error("Credential not found");
          return;
        }

        await fetchData("/api/auth/google", {
          token: credentialResponse.credential,
        });
      }}
      onError={() => {
        toast.error("Login Failed");
      }}
    />
    </div>
  );
};

export default GoogleAuth;
