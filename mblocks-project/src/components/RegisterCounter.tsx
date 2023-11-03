import React from 'react'

type RegisterCounterProps = {
  name: string
  value: number
}

export const RegisterCounter: React.FC<RegisterCounterProps> = (props) => {
  return (
    <div className='flex justify-center'>
      <div className='border-2 border-blue-500 rounded-md w-16 h-16 shadow-sm flex flex-col justify-center align-middle bg-gray-100'>
        <h1>{props.name}</h1>
        <h1>{(props.value).toString(16).padStart(4, '0')}</h1>
      </div>
    </div>
  )
}
