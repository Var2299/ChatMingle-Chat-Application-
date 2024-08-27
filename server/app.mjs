import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { Filter } from 'bad-words'; // Assuming Filter is a named export
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// MongoDB connection setup
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB!');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const db = mongoose.connection;

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
