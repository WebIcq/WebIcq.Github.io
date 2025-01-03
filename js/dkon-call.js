const serverUrl = 'https://dkon-app-call-server.crum.workers.dev/';

// Регистрация пользователя
async function registerUser(accountID) {
    const response = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountID, action: 'register' })
    });

    if (response.ok) {
        console.log('User registered successfully');
    } else {
        console.error('Error registering user:', await response.text());
    }
}

// Инициация звонка
async function callUser(callerID, recipientID, offer) {
    const response = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountID: callerID, action: 'call', to: recipientID, offer })
    });

    if (response.ok) {
        console.log('Call initiated successfully');
    } else {
        console.error('Error initiating call:', await response.text());
    }
}

// Ответ на звонок
async function answerCall(accountID, recipientID, answer) {
    const response = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountID, action: 'answer', to: recipientID, answer })
    });

    if (response.ok) {
        console.log('Answer sent successfully');
    } else {
        console.error('Error sending answer:', await response.text());
    }
}

// Отправка ICE-кандидата
async function sendIceCandidate(accountID, recipientID, candidate) {
    const response = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountID, action: 'ice-candidate', to: recipientID, candidate })
    });

    if (response.ok) {
        console.log('ICE candidate sent successfully');
    } else {
        console.error('Error sending ICE candidate:', await response.text());
    }
}