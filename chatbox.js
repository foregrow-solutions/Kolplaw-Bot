document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

let isChatOpen = false;

document.getElementById('open-chatbot').addEventListener('click', function () {
    if (!isChatOpen) {
        document.getElementById('chat-container').style.display = 'flex';
        document.getElementById('open-chatbot').innerHTML = '✖️';
        isChatOpen = true;

        if (!localStorage.getItem('greetingShown')) {
            addGreetingMessage();
            localStorage.setItem('greetingShown', 'true');
        }
    } else {
        closeChat();
    }
});

function closeChat() {
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('open-chatbot').innerHTML = '💬';
    isChatOpen = false;
}

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const messageText = inputField.value.trim();

    if (messageText) {
        addMessage(messageText, 'user');
        inputField.value = '';

        removeSuggestions();

        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading';
        loadingMessage.textContent = 'Bot is typing...';
        document.getElementById('chat-messages').appendChild(loadingMessage);
        scrollToBottom();

        const payload = {
            context: messageText
        };

        try {
            const response = await fetch(`http://localhost:3000/open-ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const botResponse = data.response;
            const suggestions = data.suggestions;

            loadingMessage.remove();
            addMessage(botResponse, 'bot');

            if (suggestions && suggestions.length > 0) {
                addSuggestions(suggestions);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            loadingMessage.remove();
            addMessage('Sorry, I could not fetch a response at the moment. Please try again later.', 'bot');
        }
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;

    if (sender === 'bot') {
        const avatar = document.createElement('img');
        if (typeof chatboxSettings !== 'undefined') {
            avatar.src = `${chatboxSettings.pluginUrl}avatar.png`
        } else {
            console.error("chatboxSettings is not defined");
        }

        avatar.className = 'avatar';
        messageDiv.appendChild(avatar);
    }

    const textNode = document.createTextNode(text);
    messageDiv.appendChild(textNode);

    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'timestamp';
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timestampDiv.textContent = currentTime;

    timestampDiv.classList.add(sender === 'user' ? 'user' : 'bot');

    messageDiv.appendChild(timestampDiv);
    document.getElementById('chat-messages').appendChild(messageDiv);

    scrollToBottom();
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addGreetingMessage() {
    const greetingMessage = "Hi, welcome to Kolplaw! Do you have a question about a personal injury case or would you like to tell us about your accident?";
    addMessage(greetingMessage, 'bot');

    const suggestions = ["I had a car accident", "I had a bike accident"];

    addSuggestions(suggestions);
}

function addSuggestions(suggestions) {
    const suggestionContainer = document.createElement('div');
    suggestionContainer.className = 'suggestion-container';

    suggestions.forEach(suggestion => {
        const suggestionButton = document.createElement('button');
        suggestionButton.className = 'suggestion-button';
        suggestionButton.textContent = suggestion;

        suggestionButton.addEventListener('click', () => {
            document.getElementById('user-input').value = suggestion;
            sendMessage();
        });

        suggestionContainer.appendChild(suggestionButton);
    });

    document.getElementById('chat-messages').appendChild(suggestionContainer);
}

function removeSuggestions() {
    const suggestionContainer = document.querySelector('.suggestion-container');
    if (suggestionContainer) {
        suggestionContainer.remove();
    }
}
