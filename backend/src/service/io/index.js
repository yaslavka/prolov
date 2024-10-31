let io;
const { Server } = require("socket.io");

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      maxHttpBufferSize: 1e12,
    });
    return io;
  },
  get: () => {
    if (!io) {
      throw new Error("socket is not initialized");
    }
    return io;
  },
};
