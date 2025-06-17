import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import pollSocket from './sockets/pollSocket.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

pollSocket(io); 

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
