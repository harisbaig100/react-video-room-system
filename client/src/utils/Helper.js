import Peer from "simple-peer";

const createPeer = (userToSignal, callerID, stream, socketRef) => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
  });

  peer.on("signal", (signal) => {
    sendSignal(userToSignal, callerID, signal, socketRef);
  });

  return peer;
};

const sendSignal = (userToSignal, callerID, signal, socketRef) => {
  socketRef.current.emit("sending signal", {
    userToSignal,
    callerID,
    signal,
  });
};

export function addPeer(incomingSignal, callerID, stream, socketRef) {
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
  }

export { createPeer };
