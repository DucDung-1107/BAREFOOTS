document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.querySelector('.chat-messages');
    const typingIndicator = document.querySelector('.typing-indicator');
    const emojiButton = document.getElementById('emoji-button');
    const attachButton = document.getElementById('attach-button');
    const fileInput = document.getElementById('file-input');

    const botAvatarUrl = 'https://placekitten.com/g/40/40'; // Replace with your bot's avatar
    const userAvatarUrl = 'https://i.pravatar.cc/40?u=currentUser'; // Replace or make dynamic

    // Initial welcome message
    setTimeout(() => {
        addMessageToChat("Hello! I'm FinnyMate. How can I assist you today?", 'bot');
    }, 500);

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userMessage = messageInput.value.trim();
        if (userMessage) {
            addMessageToChat(userMessage, 'user');
            messageInput.value = '';
            messageInput.style.height = 'auto'; // Reset height after sending
            processUserMessage(userMessage);
        }
    });

    // Auto-resize textarea (simple version)
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = (messageInput.scrollHeight) + 'px';
    });
    
    // Prevent form submission on Enter key if Shift is not pressed, for multiline.
    // But for a chat, usually Enter sends.
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            messageForm.requestSubmit(); // Use requestSubmit for proper form submission
        }
    });


    emojiButton.addEventListener('click', () => {
        // Placeholder for emoji picker functionality
        // For now, you can manually add an emoji to the input
        // messageInput.value += '😀';
        // messageInput.focus();
        alert("Emoji picker coming soon!");
    });

    attachButton.addEventListener('click', () => {
        fileInput.click(); // Trigger hidden file input
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            addMessageToChat(`File attached: ${file.name} (preview/upload not implemented)`, 'user');
            // Here you would typically handle the file upload process
            // For this demo, we're just acknowledging it.
            // You might want to send a message from the bot acknowledging the file.
            setTimeout(() => {
                 addMessageToChat(`Thanks for sharing "${file.name}". I can't process files yet, but noted!`, 'bot');
            }, 1000);
        }
        // Reset file input for next selection
        fileInput.value = '';
    });

    function addMessageToChat(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');

        const avatarImg = document.createElement('img');
        avatarImg.classList.add('avatar');
        avatarImg.src = sender === 'user' ? userAvatarUrl : botAvatarUrl;
        avatarImg.alt = sender === 'user' ? 'User Avatar' : 'Bot Avatar';

        const messageContentDiv = document.createElement('div');
        messageContentDiv.classList.add('message-content');

        const textP = document.createElement('p');
        textP.innerHTML = parseMessageText(text); // Use innerHTML to render potential HTML (like line breaks)

        const timestampSpan = document.createElement('span');
        timestampSpan.classList.add('timestamp');
        timestampSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageContentDiv.appendChild(textP);
        messageContentDiv.appendChild(timestampSpan);
        
        messageDiv.appendChild(avatarImg);
        messageDiv.appendChild(messageContentDiv);
        
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();

        // Trigger reflow for animation
        void messageDiv.offsetWidth; 
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }

    function parseMessageText(text) {
        // Simple parser: replace newlines with <br>
        // For more complex formatting (markdown, links), this would be more involved.
        return text.replace(/\n/g, '<br>');
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        typingIndicator.style.display = 'flex';
        scrollToBottom();
    }

    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    function processUserMessage(message) {
        showTypingIndicator();
        // Simulate bot thinking time
        const thinkingTime = Math.random() * 1500 + 500; // 0.5s to 2s
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            hideTypingIndicator();
            addMessageToChat(botResponse, 'bot');
        }, thinkingTime);
    }

    function getBotResponse(userInput) {
        const lcInput = userInput.toLowerCase();
        if (lcInput.includes("hello") || lcInput.includes("hi") || lcInput.includes("hey")) {
            return "Hello there! How can I help you today?";
        } else if (lcInput.includes("how are you")) {
            return "I'm doing great, thanks for asking! Ready to assist you.";
        } else if (lcInput.includes("what is your name") || lcInput.includes("who are you")) {
            return "I am FinnyMate, your friendly AI chat assistant!";
        } else if (lcInput.includes("help")) {
            return "Sure, I can help with general queries. What do you need assistance with?";
        } else if (lcInput.includes("what can you do")) {
            return "I can chat with you, answer some basic questions, and hopefully make your day a bit brighter! Ask me anything.";
        } else if (lcInput.includes("time")) {
            return `The current time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
        } else if (lcInput.includes("date")) {
            return `Today's date is ${new Date().toLocaleDateString()}.`;
        } else if (lcInput.includes("bye") || lcInput.includes("goodbye")) {
            return "Goodbye! Have a great day!";
        } else if (lcInput.includes("thanks") || lcInput.includes("thank you")) {
            return "You're welcome! 😊";
        } else if (lcInput.length < 5 && lcInput.length > 0) {
            return "Could you please elaborate a bit more?";
        } else {
            const genericResponses = [
                "That's interesting! Tell me more.",
                "I'm still learning. Could you rephrase that?",
                "I'm not sure I understand. Can you try asking in a different way?",
                "Let me think about that for a moment...",
                "Fascinating! What else is on your mind?"
            ];
            return genericResponses[Math.floor(Math.random() * genericResponses.length)];
        }
    }
});