import express from 'express';
import { createServer } from 'http'; // Using named import for createServer
import cors from 'cors';
import { Server } from 'socket.io'; // Correcting the import for socket.io to ES module syntax
import mongoose from 'mongoose';
import * as Filter from 'bad-words'; // Import all exports as a namespace

const app = express();
const server = createServer(app);
const io = new Server(server, { // Use new Server instance
    cors: {
        origin: "*"
    }
});

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/chatmingle', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB!');
});

// Define MongoDB schema and model
const chatSchema = new mongoose.Schema({
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

const filter = new Filter(); // Create a new instance of the bad-words filter

// Socket.IO setup
io.on("connection", (socket) => {
    console.log('New client connected');

    // Receive chat message from client and save to MongoDB
    socket.on("chat", async (data) => {
        const { user, message } = data;

        if (filter.isProfane(message)) {
            socket.emit("chat", { user: 'ChatBot', message: 'Your message contains inappropriate language and was not sent.' });
        } else {
            const newChatMessage = new Chat({ user, message });

            try {
                const savedChat = await newChatMessage.save();
                console.log('Saved new chat message:', savedChat);
            } catch (error) {
                console.error('Error saving chat message:', error);
            }

            // Emit chat message to all clients
            io.emit("chat", data);
        }
    });

    socket.on("disconnect", () => {
        console.log('Client disconnected');
    });
});

// Express middleware setup
app.use(cors());

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
