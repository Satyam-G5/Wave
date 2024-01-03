import React, { useEffect, useContext } from 'react'
import SocketContext from '../context/socket.context'
import { useNavigate} from 'react-router-dom'

const Calling : React.FC = () => {
    const socketcontext = useContext(SocketContext)
    const navigate = useNavigate()
    useEffect(()=>{
        console.log(socketcontext?.picked);
        socketcontext?.picked == true ? navigate('/video_call') : null
    },[socketcontext?.picked])

  return (
    <div className='bg-purple-600 h-[100vh] w-[100vw] flex flex-col items-center justify-evenly'>
        <div className='flex flex-col items-center p-3 gap-10'>
        {/* <Icon icon="ic:baseline-wifi-calling-3" color='white' height='15vh'/>
        <Icon icon="eos-icons:three-dots-loading" color='white' height='10vh'/> */}
            <h1 className='text-white font-semibold text-2xl'>Calling...</h1>
            <h2 className='text-2xl text-white font-medium'>krishna</h2>
        </div>
    </div>
  )
}

export default Calling