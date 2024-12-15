require('dotenv').config();
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.SOCKET_PORT;

function createWebSocketServer() {
    const server = http.createServer();
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A new client connected to WebSocket');

        // Handle incoming WebSocket messages or events
        socket.on('disconnect', () => {
            console.log('Client disconnected from WebSocket');
        });
    });

    server.listen(port, () => {
        console.log(`WebSocket server is listening on port ${port}`);
    });

    return io;
}

module.exports = { createWebSocketServer };
