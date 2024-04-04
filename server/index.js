const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const config = require('./config/config');

const server = http.createServer(app);

const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: [ "GET", "POST" ]
	}
})

const connectedUsers = {};
const userRoomMap = {};

io.on('connection', (socket) => {
    
  socket.on("join room", (roomId) => {
    console.log('join room called', )
    if (connectedUsers[roomId] && connectedUsers[roomId].length === config.maxRoomCapacity) {
      socket.emit("roomFull");
      return;
    }

    connectedUsers[roomId] = connectedUsers[roomId] || []; // Handle non-existent rooms
    connectedUsers[roomId].push(socket.id);
    userRoomMap[socket.id] = roomId;

    const otherUsersInRoom = connectedUsers[roomId].filter((id) => id !== socket.id);
    socket.emit("all users", otherUsersInRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerId: payload.callerID });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerId).emit('receiving returned signal', { signal: payload.signal, senderId: socket.id });
  });

  socket.on('disconnect', () => {
    const roomId = userRoomMap[socket.id];
    if (roomId) {
      connectedUsers[roomId] = connectedUsers[roomId].filter((id) => id !== socket.id);
      delete userRoomMap[socket.id];

      socket.broadcast.to(roomId).emit('user left', socket.id);
    }
  });

  socket.on('change', (payload) => {
    socket.broadcast.emit('change', payload);
  });
});

server.listen(config.port, () => {
  console.info(`Server started on port ${config.port}`);
});

server.on('error', (err) => {
  console.error('An error occurred while starting the server:', err);
});
