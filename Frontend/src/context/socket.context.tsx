import React, { createContext, ReactNode, useState, useContext, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import PeerService from "../webrtc/rtc";
const socket = io('http://localhost:8000');


interface SocketContextType {

  socket: Socket | undefined;
  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  callAccept: boolean | undefined;
  func_callAccept: () => void;
  showIncomingCallModal: any;
  handleCallUser: (s_id: any) => void;
  addsocket: () => void;

  toggleIncomingCallModal: () => void;
  // createPeerConnection : any ;

}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}


export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {


  // const [socket, setSocket] = useState<Socket>();
  const [socketid, setSocketid] = useState<string>();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [callAccept, setCallAccept] = useState(false);
  const [startstream, setStartStream] = useState(false);

  const toggleIncomingCallModal = () => {
    setShowIncomingCallModal((prev) => !prev);
  };


  const phone: any = localStorage.getItem('Phone')

  const setSocket_id = (id: any) => {
    setSocketid(id)
  }

  const func_callAccept = async () => {
    console.log("Call Accept Value Changed ");
    setCallAccept(true)

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
  };

  // ******************************************** Incomming Call **************************************************************

  const handleIncomingCall = async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
    try {
      console.log("Handle Incomming call triggered : ", from, offer);


      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);

      console.log(`Incoming Call`, from, offer);

      toggleIncomingCallModal();

      // while (!callAccept) {
      //   // You might want to add a delay to avoid a tight loop and allow other events to be processed
      //   await new Promise(resolve => setTimeout(resolve, 15000));
      // }

      console.log("call Accepted status : ", callAccept);


    
      const ans = await PeerService.getAnswer(offer);
      socket?.emit("call:accepted_res", { ans });
      console.log("Call Ans Send : ", ans);




    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  // *************************************************** After Call Accept ***************************************************************
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

  const handleCallAccepted = useCallback(async ({ from, ans }: { from: string; ans: RTCSessionDescriptionInit }) => {
    await PeerService.setLocalDescription(ans);
    console.log("Call Accepted! from : ", from);
    socket.emit("event_complete");
    // sendStreams()
  }, [])

  const sendStreams = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalStream(stream);

    for (const track of localStream?.getTracks() || []) {
      console.log("Send Stream Function Working ");
      // Check if the track is not already added
      if (!PeerService.peer.getSenders().some((sender: any) => sender.track === track)) {
        PeerService.peer.addTrack(track, localStream);
      }
    }
  }, [localStream]);

  const finalstreams = useCallback(async () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((UsersStream) => {
      setLocalStream(UsersStream)
      // UsersStream.getTracks().forEach((track: any) => {
      //     peer.peer.addTrack(track, UsersStream)
      // })

      for (const track of UsersStream.getTracks()) {
        console.log("final Stream Running ");
        PeerService.peer.addTrack(track, UsersStream)
      }
    })
  }, [])



  const Start_Final = () => {
    finalstreams();
    setStartStream(true);
    console.log("*************** All streams Started *****************");

  }


  // ****************************************************** Negotiation Handler *********************************************************

  const handleNegoNeeded = async () => {
    const offer = await PeerService.getOffer();
    socket?.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }

  const handleNegoNeedIncoming =
    async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      const ans = await PeerService.getAnswer(offer);
      socket?.emit("peer:nego:done", { to: from, ans });
    }

  const handleNegoNeedFinal = async ({ ans }: { ans: RTCSessionDescriptionInit }) => {
    await PeerService.setLocalDescription(ans)
    socket?.emit("event_complete");
    sendStreams() ;

  };

  useEffect(() => {
    PeerService.peer.addEventListener("negotiationneeded", handleNegoNeeded);

    return () => {
      PeerService.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);


  useEffect(() => {

    PeerService.peer.addEventListener("track", async (ev: any) => {
      const remoteStream = await ev.streams;
      console.log("Tracks Incomming !!", remoteStream);
      setRemoteStream(remoteStream[0]);
    });

    console.log("Track event triggered ");


  }, [sendStreams, finalstreams]);


  // ******************************** Socket Calls **************************************

  // useEffect(() => {
  //   const socketInstance = io('http://localhost:8000');
  //   setSocket(socketInstance);

  //   return () => {
  //     socketInstance.disconnect();
  //     console.log('socket disconnected');
  //   };
  // }, [setSocket]);


  useEffect(() => {


    socket?.on("getUsers", setSocket_id);
    socket?.on("incomming:call", handleIncomingCall);
    socket?.on("call:accepted", handleCallAccepted);
    socket?.on("peer:nego:needed", handleNegoNeedIncoming);
    socket?.on("peer:nego:final", handleNegoNeedFinal);
    socket?.on("Finall_Call", Start_Final);

    return () => {

      socket?.off("getUsers", setSocket_id);
      socket?.off("incomming:call", handleIncomingCall);
      socket?.off("call:accepted", handleCallAccepted);
      socket?.off("peer:nego:needed", handleNegoNeedIncoming);
      socket?.off("peer:nego:final", handleNegoNeedFinal);
      socket?.off("Finall_Call", Start_Final);

    };
  }, [
    socket,
    setSocket_id,
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
