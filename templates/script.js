// script.js
console.log("scfript init")
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatWindow = document.getElementById('chat-window');

// Store the conversation history
let conversationHistory = [];

// Function to add a message to the UI
function addMessageToUI(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.innerHTML = `<p>${message}</p>`;
    chatWindow.appendChild(messageElement);
    // Scroll to the bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Display user message
    addMessageToUI(userMessage, 'user');

    // Add user message to history
    conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });

    // Clear input field
    messageInput.value = '';

    try {
        // Send message and history to the backend
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                history: conversationHistory
            })
        });

        if (!response.ok) {
            throw new Error('Something went wrong on the backend.');
        }

        const data = await response.json();
        const botMessage = data.message;
        
        // Display bot message
        addMessageToUI(botMessage, 'bot');
        
        // Add bot message to history
        conversationHistory.push({ role: "model", parts: [{ text: botMessage }] });

    } catch (error) {
        console.error('Error fetching chat response:', error);
        addMessageToUI("Sorry, my connection to the reef is a bit murky right now. Please try again!", 'bot');
    }
});