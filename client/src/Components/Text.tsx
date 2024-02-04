import React from 'react'

const Text = ({text , additionalClass=''}:{text:string,additionalClass?:string}) => {
  return (
    <p className={` ${additionalClass}`}>{text}</p>
  )
}

export default Text