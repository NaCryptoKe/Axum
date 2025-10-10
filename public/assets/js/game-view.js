document.addEventListener("DOMContentLoaded", function () {
    // 1. Permanent/Initial Feedback Modal (for download/review/claim)
    const feedbackData = document.getElementById('feedback-data');
    const feedback = feedbackData ? feedbackData.dataset.feedback : null;
    
    if (feedback) {
        const modal = document.getElementById("feedback-modal");
        const msg = document.getElementById("modal-message");

        if (feedback === "download") {
            msg.textContent = "Thank you for downloading! Please consider leaving a review.";
        } else if (feedback === "review") {
            msg.textContent = "Thank you for submitting your review!";
        } else if (feedback === "claim") {
            msg.textContent = "Game successfully claimed! You can now download it anytime.";
        }

        modal.style.display = "block";
        document.getElementById("close-modal").onclick = () => modal.style.display = "none";
    }

    // 2. Message/Error Modal (for general updates from message query parameter)
    const messageData = document.getElementById('message-data');
    const message = messageData ? messageData.dataset.message : null;

    if (message) {
        const modal = document.getElementById("update-feedback-modal");
        
        // PHP encoded the message with urlencode() for safe passing, so decode it here.
        const decodedMessage = decodeURIComponent(message); 

        // Update the message content in the modal (if the modal exists)
        if (modal) {
            modal.querySelector('p').textContent = decodedMessage;
            modal.style.display = "block";
            document.getElementById("close-update-modal").onclick = () => modal.style.display = "none";
        }
    }
});