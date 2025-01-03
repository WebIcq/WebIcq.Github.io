 const apiUrlChat = 'https://api.dkon.app/api/v3/method/chat.get';
        const apiUrlChatPrevious = 'https://api.dkon.app/api/v3/method/chat.getPrevious';
        const apiUrlSend = 'https://api.dkon.app/api/v3/method/msg.new';
        const clientId = 1302;
        const accountId = localStorage.getItem('accountId');
        const accessToken = localStorage.getItem('accessToken');
        const urlParams = new URLSearchParams(window.location.search);
        const profileId = urlParams.get('profileId');
        const chatId = urlParams.get('chatId');
        const chatToUserId = profileId;
        const chatFromUserId = accountId;

        let lastMessageId = null;
        let oldestMessageId = null;
        const notificationSound = document.getElementById('notificationSound');

        async function loadNewMessages() {
            try {
                const formData = new FormData();
                formData.append('accountId', accountId);
                formData.append('accessToken', accessToken);
                formData.append('profileId', profileId);
                formData.append('chatFromUserId', chatFromUserId);
                formData.append('chatToUserId', chatToUserId);
                formData.append('chatId', chatId);

                const response = await fetch(apiUrlChat, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }

                const data = await response.json();

                if (data.error) {
                    console.error('Ошибка при загрузке чата:', data.error_code);
                    return;
                }

                const chatDiv = document.getElementById('chat');
                const messages = data.messages.reverse();

                if (messages.length > 0) {
                    lastMessageId = messages[messages.length - 1].id;
                    if (oldestMessageId === null) {
                        oldestMessageId = messages[0].id;
                    }
                }

                messages.forEach(message => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message';
                    messageDiv.classList.add(message.fromUserId == accountId ? 'sent' : 'received');
                    
                    const avatar = document.createElement('img');
                    avatar.src = message.fromUserPhotoUrl || 'default-avatar.png'; // Замените на путь к вашему изображению по умолчанию
                    messageDiv.appendChild(avatar);
                    
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'content';
                    contentDiv.textContent = message.message;
                    
                    const timestamp = document.createElement('span');
                    timestamp.className = 'timestamp';
                    const messageDate = new Date(message.createAt * 1000); // Используем поле createAt для времени
                    const now = new Date();
                    const diff = Math.floor((now - messageDate) / 60000); // Разница в минутах
                    timestamp.textContent = `${diff} мин. назад`;
                    timestamp.setAttribute('data-date', messageDate.toLocaleString());
                    
                    contentDiv.appendChild(timestamp);
                    messageDiv.appendChild(contentDiv);
                    chatDiv.appendChild(messageDiv);
                });

                chatDiv.scrollTop = chatDiv.scrollHeight;
            } catch (error) {
                console.error('Ошибка при загрузке новых сообщений:', error);
            }
        }

        async function loadOlderMessages() {
            if (!oldestMessageId) return;

            try {
                const formData = new FormData();
                formData.append('clientId', clientId);
                formData.append('accountId', accountId);
                formData.append('accessToken', accessToken);
                formData.append('profileId', profileId);
                formData.append('chatId', chatId);
                formData.append('msgId', oldestMessageId);

                const response = await fetch(apiUrlChatPrevious, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }

                const data = await response.json();

                if (data.error) {
                    console.error('Ошибка при загрузке старых сообщений:', data.error_code);
                    return;
                }

                const chatDiv = document.getElementById('chat');
                const messages = data.messages.reverse();
                const newMessages = [];

                if (messages.length > 0) {
                    oldestMessageId = messages[messages.length - 1].id;
                }

                messages.forEach(message => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message';
                    messageDiv.classList.add(message.fromUserId == accountId ? 'sent' : 'received');
                    
                    const avatar = document.createElement('img');
                    avatar.src = message.fromUserPhotoUrl || 'default-avatar.png'; // Замените на путь к вашему изображению по умолчанию
                    messageDiv.appendChild(avatar);
                    
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'content';
                    contentDiv.textContent = message.message;
                    
                    const timestamp = document.createElement('span');
                    timestamp.className = 'timestamp';
                    const messageDate = new Date(message.createAt * 1000); // Используем поле createAt для времени
                    const now = new Date();
                    const diff = Math.floor((now - messageDate) / 60000); // Разница в минутах
                    timestamp.textContent = `${diff} мин. назад`;
                    timestamp.setAttribute('data-date', messageDate.toLocaleString());
                    
                    contentDiv.appendChild(timestamp);
                    messageDiv.appendChild(contentDiv);
                    newMessages.push(messageDiv);
                });

                if (newMessages.length > 0) {
                    chatDiv.insertBefore(newMessages[0], chatDiv.firstChild);
                }
            } catch (error) {
                console.error('Ошибка при загрузке старых сообщений:', error);
            }
        }

        async function sendMessage() {
            const messageText = document.getElementById('messageInput').value;
            if (!messageText) return;

            try {
                const formData = new FormData();
                formData.append('clientId', clientId);
                formData.append('accountId', accountId);
                formData.append('accessToken', accessToken);
                formData.append('profileId', profileId);
                formData.append('chatToUserId', chatToUserId);
                formData.append('messageText', messageText);

                const response = await fetch(apiUrlSend, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }

                const data = await response.json();

                if (data.error) {
                    console.error('Ошибка при отправке сообщения:', data.error_code);
                    return;
                }

                document.getElementById('messageInput').value = '';
                loadNewMessages();
            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error);
            }
        }

        document.getElementById('sendButton').addEventListener('click', sendMessage);
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        document.addEventListener("DOMContentLoaded", function() {
            loadNewMessages();

            const chatDiv = document.getElementById('chat');
            chatDiv.addEventListener('scroll', () => {
                if (chatDiv.scrollTop === 0) {
                    loadOlderMessages();
                }
            });

            setInterval(loadNewMessages, 3000);
        });