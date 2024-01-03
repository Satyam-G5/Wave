import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SocketContext from '../context/socket.context';


const IncomingCallModal: React.FC= () => {

  const socketcontext = useContext(SocketContext);
  

  console.log('incomming call model executed success');
  

  const handleAccept = () => {
    console.log("handle Accept from IncommingCallModel");
    socketcontext?.func_callAccept();   
  };

  const handleReject = () => {
    socketcontext?.func_callAccept();
  };

  return (
    <div className='h-screen bg-green-700'>
      <div className="modal-content">
        <p>Incoming call from </p>
        <div className="button-container">
          <Link to ='/video_call'>
          <button onClick={handleAccept}>Accept</button>
          </Link>
          <Link to = '/'>
          <button onClick={handleReject}>Reject</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
