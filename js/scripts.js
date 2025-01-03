document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('login-form');

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
                    // Сохранение токена доступа и идентификатора аккаунта в localStorage
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('accountId', data.accountId);
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
