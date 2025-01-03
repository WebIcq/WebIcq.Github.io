
    // Функция для загрузки языкового файла
async function loadLanguage(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading language file:', error);
        return {}; // Возвращаем пустой объект, если произошла ошибка
    }
}


// Функция для перевода текста на странице
function translatePage(translations) {
    document.querySelectorAll('[dkon-trans]').forEach(element => {
        const key = element.getAttribute('dkon-trans');
        if (translations[key]) {
            if (element.tagName === 'TITLE') {
                document.title = translations[key];
            } else {
                element.innerText = translations[key];
                if (element.placeholder) {
                    element.placeholder = translations[key];
                }
            }
        }
    });
}

// Определите язык (можно изменить на основе пользовательского выбора)
const userLang = navigator.language || navigator.userLanguage; 
const lang = userLang.startsWith('ru') ? 'ru' : 'en'; // По умолчанию русский или английский

// Загрузите язык и переведите страницу
loadLanguage(lang).then(translations => {
    translatePage(translations);
});