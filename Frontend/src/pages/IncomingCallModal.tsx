import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SocketContext from '../context/socket.context';


const IncomingCallModal: React.FC = () => {

  const socketcontext = useContext(SocketContext);
  const navigate = useNavigate();

  console.log('incomming call model executed success');



  const handleReject = () => {
    navigate("/");
  };

  return (
    <div className='bg-green-600 h-[90vh] w-[100vw] flex flex-col items-center justify-evenly '>
      <p className='font-bold text-white text-3xl'>Incoming call</p>
      <p className='font-bold text-black text-2xl mt-3 font-serif'>{socketcontext?.name} </p>
      <div className="modal-content">
        <div className="flex felx-row gap-24 justify-evenly">

          <button className='h-16 w-16 rounded-full bg-green-950 text-white text-center' onClick={() => { socketcontext?.func_callAccept(); socketcontext?.setpicked(true); navigate('/video_call') }}>

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-5 lucide lucide-phone-call"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /><path d="M14.05 2a9 9 0 0 1 8 7.94" /><path d="M14.05 6A5 5 0 0 1 18 10" /></svg>
          </button>


          <button className='h-16 w-16 rounded-full bg-red-800 text-white text-center' onClick={handleReject}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-5 lucide lucide-phone-off"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" /><line x1="22" x2="2" y1="2" y2="22" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
