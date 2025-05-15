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
        } else if (lcInput.includes("FPT có chia cổ tức năm 2024 không?") || lcInput.includes("Did FPT pay dividends in 2024?")) {
            return "Dựa trên thông tin được cung cấp, FPT có lịch chia cổ tức vào ngày 9 tháng 5 năm 2024.Tuy nhiên, thông tin này chua đề cập đến mức chia cụ thể. Bạn có thể tìm hiểu thêm ở đường link sau:";
        } else if (lcInput.includes("Lợi nhuận quý I/2024 của CMG có tăng không?") || lcInput.includes("Did CMG's profit increase in Q1 2024?")) {
            return `Dựa trên thông tin tham khảo mà bạn cung cấp, tôi thấy rằng có hai giao dịch lớn liên quan đến CMG vào ngày 26/03/2024 và 05/03/2024. Tuy nhiên, thông tin này không cung cấp chi tiết về lợi nhuận quý I/2024 của CMG.
            
            Để dự đoán liệu lợi nhuận quý I/2024 của CMG có tăng hay không, chúng ta cần xem xét thêm các yếu tố như:
            
            1. Biến động thị trường: CMG là một công ty viễn thông di động, doanh thu và lợi nhuận của họ thường phụ thuộc vào tình hình kinh tế chung và thị trường viễn thông.
            
            2. Sản phẩm và dịch vụ: CMG có thể đã ra mắt các sản phẩm mới hoặc cải tiến dịch vụ nào đó, điều này có thể ảnh hưởng đến doanh thu và lợi nhuận.
            
            3. Chi phí: Chi phí vận hành, chi phí đầu tư vào mạng lưới di động, chi phí marketing, v.v., cũng có thể ảnh hưởng đến lợi nhuận.
            
            4. Số lượng cổ phiếu: Giao dịch lớn vào ngày 26/03/2024 có thể cho thấy sự thay đổi trong sở hữu cổ phiếu, nhưng không nhất thiết là doanh thu hoặc lợi nhuận tăng.
            
            5. Báo cáo tài chính: Thông tin chi tiết về doanh thu, chi phí, và lợi nhuận quý I/2024 của CMG công bố sau khi kết thúc quý, thường là vào giữa tháng 5/2024.
            
            Vì vậy, để có cái nhìn chính xác hơn về lợi nhuận quý I/2024 của CMG, chúng ta cần chờ báo cáo tài chính chính thức được công bố.`;

        } else if (lcInput.length < 5 && lcInput.length > 0) {
            return "Could you please elaborate a bit more?";
        } else {
            const genericResponses = [
                "I'm still learning. ",
                "I'm not sure I understand. Can you try asking in a different way?",
                "Let me think about that for a moment...",
                "Our Sever is down, comeback later. Sorry"
            ];
            return genericResponses[Math.floor(Math.random() * genericResponses.length)];
        }
    }
});
