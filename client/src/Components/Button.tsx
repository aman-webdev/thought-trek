import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    additionalStyles?:string;
}

const Button = ({additionalStyles = '', children,...rest}:ButtonProps) => {
  return (
    <button className={`${additionalStyles} px-8 py-3 bg-accent-light text-sm rounded-full text-gray-600`} {...rest} >{children}</button>
  )
}

export default Button