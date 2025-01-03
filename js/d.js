document.addEventListener("DOMContentLoaded", function() {
    const currentPath = window.location.pathname;

    if (currentPath.includes('dialogs.html')) {
        // Получаем токен доступа и идентификатор аккаунта из localStorage
        const accessToken = localStorage.getItem('accessToken');
        const accountId = localStorage.getItem('accountId');

        // Если токен или идентификатор аккаунта не найдены, перенаправляем на страницу авторизации
        if (!accessToken || !accountId) {
            window.location.href = 'auth.html';
            return;
        }

        // Устанавливаем значения полей формы
        document.getElementById('accountId').value = accountId;
        document.getElementById('accessToken').value = accessToken;

        // Отправляем форму и обрабатываем ответ
        const dialogsForm = document.getElementById('dialogs-form');
        const formData = new FormData(dialogsForm);

        fetch('https://api.dkon.app/api/v3/method/dialogs.get', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error && data.error_code === 0) {
                const dialogsList = document.getElementById('dialogs-list');
                data.chats.forEach(chat => {
                    const chatItem = document.createElement('div');
                    chatItem.classList.add('chat-item');
                    chatItem.innerHTML = `
                        <img src="${chat.withUserPhotoUrl}" alt="${chat.withUserFullname}" class="chat-item-photo">
                        <div class="chat-item-info">
                            <h2 class="chat-item-username">${chat.withUserFullname}</h2>
                            <p class="chat-item-last-message">${chat.lastMessage}</p>
                            <p class="chat-item-time-ago">${chat.timeAgo}</p>
                        </div>
                    `;
                    chatItem.addEventListener('click', function() {
                        window.location.href = `chat.html?profileId=${chat.withUserId}&chatId=${chat.id}`;
                    });
                    dialogsList.appendChild(chatItem);
                });
            } else {
                document.getElementById('dialogs-error').textContent = 'Failed to load dialogs. Please try again later.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('dialogs-error').textContent = 'An error occurred. Please try again later.';
        });
    }

    if (currentPath.includes('chat.html')) {
        // Получаем параметры из URL
        const urlParams = new URLSearchParams(window.location.search);
        const profileId = urlParams.get('profileId');
        const chatId = urlParams.get('chatId');

        // Получаем токен доступа и идентификатор аккаунта из localStorage
        const accessToken = localStorage.getItem('accessToken');
        const accountId = localStorage.getItem('accountId');

        // Если токен или идентификатор аккаунта не найдены, перенаправляем на страницу авторизации
        if (!accessToken || !accountId || !profileId || !chatId) {
            window.location.href = 'auth.html';
            return;
        }

        const chatFromUserId = accountId;
        const chatToUserId = profileId;

        // Функция для загрузки сообщений чата
        function loadChatMessages() {
            const formData = new FormData();
            formData.append('accountId', accountId);
            formData.append('accessToken', accessToken);
            formData.append('profileId', profileId);
            formData.append('chatFromUserId', chatFromUserId);
            formData.append('chatToUserId', chatToUserId);
            formData.append('chatId', chatId);

            fetch('https://api.dkon.app/api/v3/method/chat.get', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error && data.error_code === 0) {
                    const chatMessages = document.getElementById('chat-messages');
                    chatMessages.innerHTML = ''; // Очищаем предыдущие сообщения
                    data.messages.forEach(message => {
                        const messageItem = document.createElement('div');
                        messageItem.classList.add('message-item');
                        messageItem.innerHTML = `
                            <p><strong>${message.fromUserFullname}:</strong> ${message.message}</p>
                            <p class="message-time">${message.timeAgo}</p>
                        `;
                        chatMessages.appendChild(messageItem);
                    });
                } else {
                    document.getElementById('chat-error').textContent = 'Failed to load messages. Please try again later.';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('chat-error').textContent = 'An error occurred. Please try again later.';
            });
        }

        // Загрузка сообщений чата при загрузке страницы
        loadChatMessages();

        // Обработка отправки нового сообщения
        const messageForm = document.getElementById('message-form');
        messageForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const messageInput = document.getElementById('message');
            const message = messageInput.value;

            const formData = new FormData();
            formData.append('accountId', accountId);
            formData.append('accessToken', accessToken);
            formData.append('profileId', profileId);
            formData.append('chatFromUserId', chatFromUserId);
            formData.append('chatToUserId', chatToUserId);
            formData.append('chatId', chatId);
            formData.append('message', message);

            fetch('https://api.dkon.app/api/v3/method/chat.send', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error && data.error_code === 0) {
                    // Очищаем поле ввода и перезагружаем сообщения чата
                    messageInput.value = '';
                    loadChatMessages();
                } else {
                    document.getElementById('chat-error').textContent = 'Failed to send message. Please try again later.';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('chat-error').textContent = 'An error occurred. Please
