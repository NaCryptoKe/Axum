// assets/js/chat-logic.js
document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chat-history');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    // Reads the chat handler URL from the body's data attribute
    const CHAT_HANDLER_URL = document.body.getAttribute('data-chat-handler-url'); 

    if (!CHAT_HANDLER_URL) {
        console.error("CHAT_HANDLER_URL is not defined on the body element.");
        return;
    }

    function appendMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'model-message');
        messageDiv.innerHTML = message;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function appendTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('model-message', 'typing-indicator');
        indicator.innerHTML = `<span>.</span><span>.</span><span>.</span>`; 
        chatHistory.appendChild(indicator);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        return indicator;
    }

    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        appendMessage('user', userMessage);
        chatInput.value = '';

        const loadingIndicator = appendTypingIndicator();

        try {
            const response = await fetch(CHAT_HANDLER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                credentials: 'include',
                body: `user_input=${encodeURIComponent(userMessage)}`
            });

            const data = await response.json();
            // Replace the indicator with the actual response content
            loadingIndicator.classList.remove('typing-indicator');
            loadingIndicator.innerHTML = data.response; 

        } catch (error) {
            console.error('Error:', error);
            // Replace the indicator with an error message
            loadingIndicator.classList.remove('typing-indicator');
            loadingIndicator.innerHTML = "Connection Error. Please try again.";
        }
    }

    if (sendButton) sendButton.addEventListener('click', sendMessage);

    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Initial welcome message
    appendMessage('model', "Hi! I'm Axum, your AI support. How can I help you with Axum Arcade today...");
});