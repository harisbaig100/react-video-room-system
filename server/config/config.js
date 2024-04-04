const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    maxRoomCapacity: process.env.MAX_ROOM_CAPACITY || 4,
  };
  
module.exports = config;