document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const registerError = document.getElementById('register-error');

    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Очистка предыдущих ошибок
        registerError.textContent = '';

        const formData = new FormData(registerForm);
        formData.append('clientId', '1302');
        formData.append('hash', 'U2F5YSBzdWthIGtldGlrYSBBbGV4YSBtZW5pZHVyaSBzYXlh');
        formData.append('appType', '1');

        try {
            const response = await fetch('https://api.dkon.app/api/v2/method/account.signUp', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }

            const data = await response.json();

            if (data.error) {
                // Обработка ошибок от API
                registerError.textContent = `Error: ${data.error_code}`;
            } else {
                // Регистрация успешна, сохраняем токен и ID пользователя
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('accountId', data.accountId);
                
                // Перенаправляем пользователя на страницу авторизации
                window.location.href = 'auth.html';
            }
        } catch (error) {
            // Обработка сетевых ошибок
            registerError.textContent = `Error: ${error.message}`;
        }
    });
});
