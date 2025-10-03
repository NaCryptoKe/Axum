<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AxumArcade Support</title>
    <link rel="icon" type="image/png" href="./assets/img/LOGO.svg">
    <link rel="stylesheet" href="./assets/css/theme.css">
    <link rel="stylesheet" href="./assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <?php include '../views/layout/header.php'; ?>
    <main>
        <?php include '../views/layout/side-bar.php'; ?>

        <div class="content">            
            <div class="chat-widget">
                <div class="chat-history" id="chat-history">
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" class="chat-input" placeholder="Ask me anything...">
                    <button id="send-button" class="send-button">Send</button>
                </div>
            </div>
        </div>
    </main>

<script>
    const sendButton = document.getElementById('send-button');
    const chatInput = document.getElementById('chat-input');
    const chatHistory = document.getElementById('chat-history');

    function appendMessage(role, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(`${role}-message`);
        messageDiv.innerText = text;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        return messageDiv;
    }

    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // User message
        appendMessage('user', userMessage);
        chatInput.value = '';

        // Loading bubble for AI
        const loadingIndicator = appendMessage('model', '...');

        try {
            const response = await fetch('../app/config/chat_handler.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `user_input=${encodeURIComponent(userMessage)}`
            });

            const data = await response.json();
            loadingIndicator.innerText = data.response;

        } catch (error) {
            console.error('Error:', error);
            loadingIndicator.innerText = "Connection Error. Please try again.";
        }
    }
    function appendTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('model-message');

        const typing = document.createElement('div');
        typing.classList.add('typing-indicator');

        typing.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        indicator.appendChild(typing);
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
            const response = await fetch('../app/config/chat_handler.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `user_input=${encodeURIComponent(userMessage)}`
            });

            const data = await response.json();
            loadingIndicator.innerHTML = data.response;

        } catch (error) {
            console.error('Error:', error);
            loadingIndicator.innerHTML = "Connection Error. Please try again.";
        }
    }


    // Send on click
    sendButton.addEventListener('click', sendMessage);

    // Send on Enter
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Initial AI greeting
    window.addEventListener('DOMContentLoaded', () => {
        appendMessage('model', "Hi! I'm Axum, your AI support. How can I help you with Axum Arcade today?");
    });

    


</script>
</body>
</html>
