import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { Filter } from 'bad-words';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || '*', // Use environment variable for allowed origins
        methods: ['GET', 'POST']
    }
});

// MongoDB connection setup using Mongoose
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
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
                await newChatMessage.save();
                console.log('Saved new chat message:', { user, message });
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
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Use environment variable for allowed origins
    methods: ['GET', 'POST']
}));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Global error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
