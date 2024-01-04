import React, { createContext, ReactNode, useState, useContext, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import PeerService from "../webrtc/rtc";
const socket = io('http://localhost:8000');


interface SocketContextType {

  socket: Socket | undefined;
  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  callAccept: boolean | undefined;
  showIncomingCallModal: any;
  picked : boolean | undefined;
  setpicked : any;
  name : string ;
  setName : any ;
  Callphone : any ;
  setCallphone : any ;
  func_callAccept: () => void;
  calling : (Name : any) => void;
  handleCallUser: (s_id: any) => void;
  addsocket: () => void;
  toggleIncomingCallModal: () => void;

}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}


export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {


  const [socketid, setSocketid] = useState<string>();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [callAccept, setCallAccept] = useState(false);
  const [picked , setpicked] = useState<boolean>();
  const [name , setName] = useState<string>("")
  const [call , setCall] = useState<boolean>();
  const [Callphone , setCallphone] = useState<any>();


  const toggleIncomingCallModal = () => {
    setShowIncomingCallModal((prev) => !prev);
  };


  const phone: any = localStorage.getItem('Phone')

  const setSocket_id = (id: any) => {
    setSocketid(id)
  }

  // Adding socketid to database each time user logins 
  
  const addsocket = async () => {
    
    const sendsocket: string = String(socketid);
    socket?.emit('addUser', phone, sendsocket);

  }

  // ********************************************** Start Calling *************************************************************

  const handleCallUser = async (phoneid: any) => {

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalStream(stream)
    
    const offer = await PeerService.getOffer();
    console.log(`offer sdp: ${offer.sdp} , phone : ${phoneid} , socketId : ${socketid}`);
    socket?.emit("user_calling", { phoneid, socketid, offer });
    setCall(true)
  };
  
  // ******************************************** Incomming Call **************************************************************
  
  const func_callAccept = async () => {
    console.log("function callAccept executed ");
    socket.emit('call_recived');
    setCallAccept(true)   

  }
 
  function calling (Name : any) {
    toggleIncomingCallModal();
    setName(Name);
  }


  const handleIncomingCall = async ({ from, sendoffer }: { from: string; sendoffer: RTCSessionDescriptionInit }) => {
    try {
      console.log("Handle Incomming call triggered : ", from, sendoffer);
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);

      console.log(`Incoming Call`, from, sendoffer);

      const ans = await PeerService.getAnswer(sendoffer);
      socket?.emit("call:accepted_res", { ans });
      console.log("Call Ans Send : ", ans);

    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  // *************************************************** After Call Accept ***************************************************************
  const handleCallAccepted = useCallback(async ({ from, ans }: { from: string; ans: RTCSessionDescriptionInit }) => {
    setpicked(true);
    await PeerService.setLocalDescription(ans);
    console.log("Call Accepted! from : ", from);

    socket.emit("eventcomplete");
   
  }, [])


  const sendStreams = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalStream(stream);

       for (const track of localStream?.getTracks() || []) {
          PeerService.peer.addTrack(track, localStream);
          console.log("send streams called");

      }

    // for (const track of localStream?.getTracks() || []) {
    //   console.log("Send Stream Function Working ");

    //   // Check if the track is not already added
    //   if (!PeerService.peer.getSenders().some((sender: any) => sender.track === track)) {
    //     PeerService.peer.addTrack(track, localStream);
    //   }
    // }

    

  }, [localStream]);


  const Start_Final = () => {
    sendStreams() ;
    // console.log("*************** All streams Started *****************");

  }


  // ****************************************************** Negotiation Handler *********************************************************

  async function handleNegoNeeded () {
    if(call == true){
      const offer = await PeerService.getOffer();
      // console.log("HandleNegoNeeded Triggered");
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }else{
      console.log("error else condition executed");     
    }
  }

  async function handleNegoNeedIncoming  ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) {
      const ans = await PeerService.getAnswer(offer);
      // console.log("handleNegoNeedIncoming Triggered");
      sendStreams();
      socket.emit("peer:nego:done", { to: from, ans });
    }


  async function handleNegoNeedFinal({ ans }: { ans: RTCSessionDescriptionInit }) {
    try {
      console.log("handleNegoNeedFinal Triggered ");

      await PeerService.setLocalDescription(ans).then(()=>{
        socket.emit("eventcomplete");
      })

    } catch (error) {
      console.log("The error in Final Nego ", error);
    }
  };

  useEffect(() => {
    PeerService.peer.addEventListener("negotiationneeded", handleNegoNeeded);
      // console.log("UseEffect of negotiationneed triggered ");
      
    return () => {
      PeerService.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
      // console.log("Negotiation need removed event ");
    };
  }, [handleNegoNeeded]);


  useEffect(() => {

    PeerService.peer.addEventListener("track", async (ev: any) => {
      const [remoteStream] = await ev.streams;
      // console.log("Tracks Incomming !!", remoteStream);
      setRemoteStream(remoteStream);
    });

  }, []);


  // ******************************** Socket Calls **************************************

  useEffect(() => {


    socket.on("getUsers", setSocket_id);
    socket.on("call_incoming" , calling);
    socket.on("incomming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("Finall_Call", Start_Final);

    return () => {

      socket.off("getUsers", setSocket_id);
      socket.off("call_incoming" , calling);
      socket.off("incomming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("Finall_Call", Start_Final);

    };
  }, [
    socket,
    setSocket_id,
    calling,
    handleIncomingCall, 
    handleCallAccepted,
    handleNegoNeedIncoming,
    handleNegoNeedFinal,
    Start_Final
  ]);


  const contextValue: SocketContextType = {
    socket,
    localStream,
    remoteStream,
    showIncomingCallModal,
    callAccept,
    picked,
    name , 
    Callphone,
    setCallphone,
    setName ,
    setpicked,
    calling ,
    func_callAccept,
    toggleIncomingCallModal,
    handleCallUser,
    addsocket
  };


  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
export default SocketContext;




  // const sendStreams = useCallback(()=>{


  //   for (const track of localStream?.getTracks() || []) {
  //         PeerService.peer.addTrack(track, localStream);
  //         setStartStream(true);
  //         console.log("send streams called");

  //     }
  //     // UsersStream.getTracks().forEach((track: any) => {
  //       //     peer.peer.addTrack(track, UsersStream)
  //       // })

  //     // for (const track of localStream.getTracks()) {
  //     //   PeerService.peer.addTrack(track, localStream)
  //     // }

  // },[localStream]) 

