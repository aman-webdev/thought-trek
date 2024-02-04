import { InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
additionalStyles?:string
register?: UseFormRegister<any>
name?:string
validation?:any
}


const Input = ({additionalStyles='',name,register,validation,...rest}:InputProps) => {
  return (
    <input className={` ${additionalStyles}` } {...((register && name) ? register(name,validation)  : {})} {...rest} />
  )
}

export default Input