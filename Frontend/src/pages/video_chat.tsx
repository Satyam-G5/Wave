import React, { useEffect, useState, useContext } from "react";
import ReactPlayer from "react-player";
import SocketContext from "../context/socket.context";

const VideoChat: React.FC = () => {
    const contextSocket = useContext(SocketContext);

    const [myStream, setMyStream] = useState<MediaStream | undefined>();
    const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>();

    useEffect(()=>{

    setMyStream(contextSocket?.localStream)
    setRemoteStream(contextSocket?.remoteStream)

    console.log("local stream : " , contextSocket?.localStream)
    console.log("remote stream : " , contextSocket?.remoteStream)
    
    } , [contextSocket?.localStream , contextSocket?.remoteStream ])

  

    return (
        <div className=" h-screen bg-custom">
            <div className="mt-20 bg-custom">
                <h1 className="mt-12 p-2 text-4xl text-black font-semibold">Video Conferencing</h1>

                <div className="mt-4 flex flex-row justify-evenly ">

                  
                    {contextSocket?.localStream && (
                        <>
                            <h1 className="font-semibold">MY STREAM</h1>
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
                            <h1 className="border-4 border-red-950">Remote Stream</h1>
                            <ReactPlayer
                                playing
                                muted
                                height="100px"
                                width="200px"
                                url={contextSocket?.remoteStream} // Adjust this to match the correct property
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoChat;
    