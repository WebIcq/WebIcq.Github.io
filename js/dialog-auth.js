// Функция для проверки наличия токена и ID аккаунта в localStorage
function checkAccessToken() {
    const accessToken = localStorage.getItem('accessToken');
    const accountId = localStorage.getItem('accountId');

    // Проверяем, есть ли accessToken и accountId
    if (!accessToken || !accountId) {
        // Если одно из значений пустое, переходим на страницу index-dkon.html
        window.location.href = 'index-dkon.html';
        return; // Завершаем выполнение функции
    }

    // Если есть, отправляем POST-запрос
    const params = new URLSearchParams();
    params.append('clientId', 1302);
    params.append('accountId', accountId);
    params.append('accessToken', accessToken);

    fetch('https://api.dkon.app/api/v3/method/account.authorize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString() // Преобразуем параметры в строку
    })
    .then(response => {
        // Проверяем, был ли ответ успешным
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Проверяем ответ от сервера
        if (data.error === false && data.error_code === 0) {
            // Если нет ошибки, переходим на страницу dialogs.html
           // window.location.href = 'dialogs.html';
        } else {
            console.log('Ошибка от сервера:', data);
           window.location.href = 'https://web.dkon.app/#error_dialog_auth';
        }
    })
    .catch(error => {
        console.error('Ошибка при выполнении запроса:', error);
    });
}

// Вызываем функцию проверки
checkAccessToken();
