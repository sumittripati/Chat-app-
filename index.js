let http = require('http');
let express = require("express");
let path = require("path");
let { Server } = require('socket.io');

let app = express();
let server = http.createServer(app);
let io = new Server(server);

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A new user connected:', socket.id);

    // Listen for "user-message" events from the client
    socket.on("user-message", (message) => {
        console.log("Received message from user:", message);

        // Broadcast the message to all connected clients
        io.emit("broadcast-message", message);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for serving the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server on port 9000
server.listen(9000, () => {
    console.log('Server is running on http://localhost:9000');
});
