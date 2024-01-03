import React, { useContext } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import SocketContext from '../context/socket.context';


const IncomingCallModal: React.FC= () => {

  const socketcontext = useContext(SocketContext);
  const navigate = useNavigate() ;

  console.log('incomming call model executed success');
  

  // const handleAccept = () => {
  //   console.log("handle Accept from IncommingCallModel");
  //   socketcontext?.func_callAccept();   
  // };

  const handleReject = () => {
    socketcontext?.func_callAccept();
  };

  return (
    <div className='h-screen bg-green-700'>
      <div className="modal-content">
        <p>Incoming call from </p>
        <div className="button-container">
          
          <button onClick={()=>{socketcontext?.func_callAccept() ; socketcontext?.setpicked(true) ; navigate('/video_call')}}>Accept</button>
        
          <Link to = '/'>
          <button onClick={handleReject}>Reject</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
