import React from 'react'
import moment from 'moment'

const CustomDate = ({date}:{date:string}) => {

    const formatted = moment(date).format("dddd Do MMM")

  return (
    <p className='opacity-70'>{formatted}</p>
  )
}

export default CustomDate