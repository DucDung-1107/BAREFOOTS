document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.querySelector('.chat-messages');
    const typingIndicator = document.querySelector('.typing-indicator');
    const emojiButton = document.getElementById('emoji-button');
    const attachButton = document.getElementById('attach-button');
    const fileInput = document.getElementById('file-input');

    const botAvatarUrl = 'https://placekitten.com/g/40/40';
    const userAvatarUrl = 'https://i.pravatar.cc/40?u=currentUser';

    setTimeout(() => {
        addMessageToChat("Hello! I'm FinnyMate. How can I assist you today?", 'bot');
    }, 500);

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userMessage = messageInput.value.trim();
        if (userMessage) {
            addMessageToChat(userMessage, 'user');
            messageInput.value = '';
            messageInput.style.height = 'auto';
            processUserMessage(userMessage);
        }
    });

    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            messageForm.requestSubmit();
        }
    });

    emojiButton.addEventListener('click', () => {
        alert("Emoji picker coming soon!");
    });

    attachButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            addMessageToChat(`File attached: ${file.name} (preview/upload not implemented)`, 'user');
            setTimeout(() => {
                addMessageToChat(`Thanks for sharing "${file.name}". I can't process files yet, but noted!`, 'bot');
            }, 1000);
        }
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
        textP.innerHTML = parseMessageText(text);

        const timestampSpan = document.createElement('span');
        timestampSpan.classList.add('timestamp');
        timestampSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageContentDiv.appendChild(textP);
        messageContentDiv.appendChild(timestampSpan);

        messageDiv.appendChild(avatarImg);
        messageDiv.appendChild(messageContentDiv);

        messagesContainer.appendChild(messageDiv);
        scrollToBottom();

        void messageDiv.offsetWidth;
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }

    function parseMessageText(text) {
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

    async function processUserMessage(message) {
        showTypingIndicator();
        try {
            const response = await fetch("http://localhost:8000/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: message,
                    max_new_tokens: 200,
                    temperature: 0.7,
                    do_sample: true
                })
            });

            const data = await response.json();
            hideTypingIndicator();

            if (data.response) {
                addMessageToChat(data.response, 'bot');
            } else {
                throw new Error("Empty response");
            }
        } catch (error) {
            hideTypingIndicator();
            console.error("Fallback to local botResponse due to error:", error);
            const fallbackResponse = getBotResponse(message);
            addMessageToChat(fallbackResponse, 'bot');
        }
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
