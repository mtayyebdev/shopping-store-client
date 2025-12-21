import React from 'react'

function Heading({title}) {
  return (
    <div className='flex items-center justify-start gap-4 h-10'>
        <span className='bg-secondary2 h-full w-5 rounded'></span>
        <span className='text-secondary2 font-semibold text-lg'>{title}</span>
    </div>
  )
}

export default Heading