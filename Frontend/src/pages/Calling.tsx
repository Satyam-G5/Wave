import React, { useEffect, useContext } from 'react'
import SocketContext from '../context/socket.context'
import { useNavigate } from 'react-router-dom'

const Calling: React.FC = () => {
  const socketcontext = useContext(SocketContext)
  const navigate = useNavigate()
  useEffect(() => {
    console.log(socketcontext?.picked);
    socketcontext?.picked == true ? navigate('/video_call') : null
  }, [socketcontext?.picked])

  return (
    <div className='bg-custom mt-16'>
      <div className='bg-green-600 h-[90vh] w-[100vw] mt-4 flex flex-col items-center justify-evenly'>
        <div className='flex flex-col items-center p-3 gap-10'>
          <h1 className='text-white mt-12 font-bold text-center text-4xl'>Calling</h1>
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-phone-call"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /><path d="M14.05 2a9 9 0 0 1 8 7.94" /><path d="M14.05 6A5 5 0 0 1 18 10" /></svg>
          <div className='flex flex-col'>
          <h2 className='text-3xl text-black text-center font-bold font-serif'>{socketcontext?.name}</h2>
          <h2 className='text-2xl text-white text-center mt-2 p-2 font-medium'>{socketcontext?.Callphone}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calling