const { remote } = require('electron');
const store = remote.require('electron-store')();

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('login-form');

    // Проверка наличия сохраненных данных
    const savedAccessToken = store.get('accessToken');
    const savedAccountId = store.get('accountId');

    if (savedAccessToken && savedAccountId) {
        // Если данные есть, перенаправляем на страницу диалогов
        window.location.href = 'dialogs.html';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(loginForm);
            
            fetch('https://api.dkon.app/api/v3/method/account.signIn', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error && data.error_code === 0) {
                    // Сохранение токена доступа и идентификатора аккаунта в electron-store
                    store.set('accessToken', data.accessToken);
                    store.set('accountId', data.accountId);
                    // Перенаправление на страницу диалогов
                    window.location.href = 'dialogs.html';
                } else {
                    document.getElementById('login-error').textContent = 'Login failed. Please check your credentials.';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('login-error').textContent = 'An error occurred. Please try again later.';
            });
        });
    }
});
