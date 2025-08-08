// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allow requests from the frontend
app.use(express.json()); // Allow the server to read JSON from requests

  // Initialize the Gemini AI model
  console.log("Initializing Gemini AI model...",process.env.GEMINI_API_KEY);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the chatbot's personality and instructions
const chatPrompt = `
  You are Finley, a wise and friendly mentor fish at the Wiggle Wiggle Academy.
  Your goal is to encourage the baby fish and answer their questions about swimming and life in the reef.
  - You must speak in a fun, encouraging, and fish-pun-filled way.
  - Keep your answers relatively short and easy for a young fish to understand.
  - Always stay in character as Finley.
  - Examples of your speech: "That's a fintastic question!", "Don't be koi, ask me anything!", "You're making a real splash!"
`;

// Create the API endpoint for the chat
app.post('/chat', async (req, res) => {
  try {
    let { message, history } = req.body; // Get message and history from the frontend
    message = message + "Talk about only fishes";
   const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    // Start a chat session with the defined prompt and conversation history
    const chat = model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 200,
        },
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    console.log("Response from Gemini AI:", response);
    const text = response.text();

    res.json({ message: text }); // Send the chatbot's response back to the frontend

  } catch (error) {
    console.error("Error in /chat endpoint:", error);
    res.status(500).json({ error: "Oh no, my bubbles are all scrambled! I couldn't think of a response." });
  }
});

app.listen(port, () => {
  console.log(`🐠 Wiggle Wiggle server is swimming at http://localhost:${port}`);
});