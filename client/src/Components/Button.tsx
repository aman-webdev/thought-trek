import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    additionalStyles?:string;
}

const Button = React.forwardRef<HTMLButtonElement,ButtonProps>(({additionalStyles = '', children,...rest},ref)=>{
  return (
    <button  className={` px-8 py-3 bg-accent-light text-sm rounded-full text-gray-600 ${additionalStyles}` } {...rest} ref={ref} >{children}</button>
  )
})

export default Button