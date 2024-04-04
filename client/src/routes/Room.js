import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { micmute, micunmute, webcam, webcamoff } from "../assets";
import Video from '../components/Video'; // Importing Video component
import Peer from "simple-peer";

import {
    Container,
    Controls,
    ControlSmall,
    ImgComponent,
    ImgComponentSmall,
    StyledVideo,
  } from './RoomStyles'

const Room = () => {
  const [peers, setPeers] = useState([]);
  const [audioFlag, setAudioFlag] = useState(true);
  const [videoFlag, setVideoFlag] = useState(true);
  const [userUpdate, setUserUpdate] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const { roomID } = useParams(); // Get roomID from useParams hook
  const videoConstraints = {
    minAspectRatio: 1.333,
    minFrameRate: 60,
    height: window.innerHeight / 1.8,
    width: window.innerWidth / 2,
  };

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:8080");
    createStream();

    const cleanup = () => {
        socketRef.current.off("all users");
        socketRef.current.off("user joined");
        socketRef.current.off("user left");
        socketRef.current.off("receiving returned signal");
        socketRef.current.off("change");
    };

    return cleanup;
}, []);

  const handleAllUsers = (users, stream) => {
    const peers = [];
    users.forEach((userID) => {
      const peer = createPeer(userID, socketRef.current.id, stream);
      peersRef.current.push({
        peerID: userID,
        peer,
      });
      peers.push({
        peerID: userID,
        peer,
      });
    });
    setPeers(peers);
  };
  
  const handleUserJoined = (payload, stream) => {
    if(!payload.callerID) return;
    const peer = addPeer(payload.signal, payload.callerID, stream);
    peersRef.current.push({
      peerID: payload.callerID,
      peer,
    });
    const peerObj = {
      peer,
      peerID: payload.callerID,
    };
    setPeers((users) => [...users, peerObj]);
  };
  
  const handleUserLeft = (id) => {
    const peerObj = peersRef.current.find((p) => p.peerID === id);
    if (peerObj) {
      peerObj.peer.destroy();
    }
    const peers = peersRef.current.filter((p) => p.peerID !== id);
    peersRef.current = peers;
    setPeers(peers);
  };
  
  const handleReceivingReturnedSignal = (payload) => {
    const item = peersRef.current.find((p) => p.peerID === payload.id);
    item.peer.signal(payload.signal);
  };
  
  const handleChange = (payload) => {
    setUserUpdate(payload);
  };

  const handleToggle = (type) => {
    if (userVideo.current.srcObject) {
      userVideo.current.srcObject.getTracks().forEach(function (track) {
        if ((type === "video" && track.kind === "video") || (type === "audio" && track.kind === "audio")) {
          const newFlag = !track.enabled;
          const newUpdate = [...userUpdate, {
            id: socketRef.current.id,
            videoFlag: type === "video" ? newFlag : videoFlag,
            audioFlag: type === "audio" ? newFlag : audioFlag,
          }];
          socketRef.current.emit("change", newUpdate);
          track.enabled = newFlag;
          type === "video" ? setVideoFlag(newFlag) : setAudioFlag(newFlag);
        }
      });
    }
  };

  const createPeer = (userToSignal, callerID, stream) => {
    // Check if the peer already exists in the peers state
    const existingPeer = peers.find(peer => peer.peerID === userToSignal);
    
    if (existingPeer) {
      console.log("Peer already exists in peers state, skipping signal sending.");
      return;
    }
  
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
  
    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });
  
    return peer;
  };
  

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
  
    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });
  
    peer.signal(incomingSignal);
  
    return peer;
  };

  console.log('peers', peers)
    
  const createStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", (users) => handleAllUsers(users, stream));
        socketRef.current.on("user joined", (payload) => handleUserJoined(payload, stream));
        socketRef.current.on("user left", (id) => handleUserLeft(id));
        socketRef.current.on("receiving returned signal", (payload) => handleReceivingReturnedSignal(payload));
        socketRef.current.on("change", (payload) => handleChange(payload));
      }).catch((err) => {console.log(err)});
  };
  
  return (
    <Container>
        <StyledVideo muted ref={userVideo} autoPlay playsInline />
        <Controls>
            <ImgComponent
            src={videoFlag ? webcam : webcamoff}
            onClick={() => handleToggle("video")}
            />
            &nbsp;&nbsp;&nbsp;
            <ImgComponent
            src={audioFlag ? micunmute : micmute}
            onClick={() => handleToggle("audio")}
            />
        </Controls>
        {peers.map((peer, index) => {
            const foundEntry = userUpdate.find(entry => entry.id === peer.peerID);
            const audioFlagTemp = foundEntry ? foundEntry.audioFlag : true;
            const videoFlagTemp = foundEntry ? foundEntry.videoFlag : true;

            return (
                <div key={peer.peerID} style={{ marginTop: '60px' }}>
                <Video peer={peer.peer} />
                <ControlSmall>
                    <ImgComponentSmall src={videoFlagTemp ? webcam : webcamoff} />
                    &nbsp;&nbsp;&nbsp;
                    <ImgComponentSmall src={audioFlagTemp ? micunmute : micmute} />
                </ControlSmall>
                </div>
            );
        })}
        </Container>

  );
};

export default Room;