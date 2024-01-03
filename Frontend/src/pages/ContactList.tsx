import React, { useEffect, useState , useContext} from 'react'
import { Link } from 'react-router-dom';
import SocketContext from '../context/socket.context';
import IncomingCallModal from './IncomingCallModal';

interface Contact {
  firstname: string;
  lastname: string;
  socketId: string;
  phone_no: number;
}


const ContactList: React.FC = () => {

  const [contacts, setContacts] = useState<Contact[]>([])
  const [showcall, setShowcall] = useState(false)
  const socketcontext = useContext(SocketContext);


  const callButton = (phoneid : any  ) =>{
    console.log("Call Initiated with : ", phoneid);
    
    socketcontext?.handleCallUser(phoneid);
  }

  useEffect(()=>{
    setShowcall(socketcontext?.showIncomingCallModal)
  },[socketcontext?.showIncomingCallModal])

  const all_users = async () => {
    try {
      const response = await fetch("/all_user", {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json',
        }
      });

      if (response.ok) {
        const user_response = await response.json();
        console.log(user_response);

        setContacts( [

          ...user_response.user.map((user: any) => ({
            firstname: user.firstname,
            lastname: user.lastname,
            socketId: user.socketid,
            phone_no: user.phoneno,
          })),
        ]);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };


  useEffect(() => {
    all_users();
  }, [])



  return (
    <div className='mt-20 bg-custom h-screen'>
    {showcall ? <div><IncomingCallModal/></div> : <div>
    <h1 className='text-center text-5xl p-10 font-serif font-semibold'>Contact List </h1>
    <div className="w-60vh ml-52 mr-52 grid grid-cols-1 gap-y-4 border-gradient">
      {contacts.map((contact: Contact) => (
        <div key={contact.socketId} className="flex items-center border-b border-gray-300 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 lucide lucide-contact"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect width="18" height="18" x="3" y="4" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" x2="8" y1="2" y2="4"/><line x1="16" x2="16" y1="2" y2="4"/></svg>
          <div className="flex-1">
            <p className="text-lg font-semibold">{contact.firstname}</p>
            <p className="text-gray-500">{contact.phone_no}</p>
          </div>
          <Link to = "/video_call">
          
          <button onClick={() => callButton(contact.phone_no)} className="bg-green-500 hover:text-black text-white flex flex-row px-4 py-2 rounded transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 lucide lucide-phone-outgoing"><polyline points="22 8 22 2 16 2"/><line x1="16" x2="22" y1="8" y2="2"/><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <div className='p-1 ml-2' >Call</div>

          </button>
          </Link>
        </div>
      ))}
    </div>
    </div> }
  </div>
  );
};

export default ContactList
