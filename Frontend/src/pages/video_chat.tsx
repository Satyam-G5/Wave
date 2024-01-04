import React, {useContext } from "react";
import ReactPlayer from "react-player";
import SocketContext from "../context/socket.context";
import AppContext from "../context/user.context";

const VideoChat: React.FC = () => {
    const contextSocket = useContext(SocketContext);
    const contextapp = useContext(AppContext);

    // const [myStream, setMyStream] = useState<MediaStream | undefined>();
    // const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>();

    // useEffect(()=>{

    // setMyStream(contextSocket?.localStream)
    // setRemoteStream(contextSocket?.remoteStream)

    // console.log("local stream : " , contextSocket?.localStream)
    // console.log("remote stream : " , contextSocket?.remoteStream)
    
    // } , [contextSocket?.localStream , contextSocket?.remoteStream ])
   
  

    return (
        <div className=" h-screen bg-custom">
            <div className="mt-20 bg-custom">
                <h1 className="mt-12 p-2 text-4xl text-black font-semibold">Video Conferencing</h1>

                <div className="mt-4 flex md:flex-row flex-col justify-evenly ">

                  
                    {contextSocket?.localStream && (
                        <>
                            <h1 className="font-semibold">{contextapp?.Name}</h1>
                            <div className="border-4 border-green-950 rounded-full overflow-hidden">
                                <ReactPlayer
                                    playing
                                    muted
                                    height="300px"
                                    width="400px"
                                    url={contextSocket?.localStream} // Adjust this to match the correct property
                                />

                            </div>
                        </>
                    )}

                    {contextSocket?.remoteStream && (
                        <>
                            <h1 className="font-semibold">{contextSocket.name}</h1>
                            <div className="border-4 border-green-950 rounded-full overflow-hidden">

                            <ReactPlayer
                                playing
                                muted
                                height="300px"
                                width="400px"
                                url={contextSocket?.remoteStream} // Adjust this to match the correct property
                            />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoChat;
    