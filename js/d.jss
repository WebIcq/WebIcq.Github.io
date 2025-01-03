document.addEventListener("DOMContentLoaded", function() {
    // Проверяем, на какой странице мы находимся
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
});
