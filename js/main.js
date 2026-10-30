// main.js — запуск игры, связывает логику, интерфейс и управление. Автор: Данил Лобанов

// Начинает новую игру с выбранным уровнем сложности
function startGame() {
    const level = document.getElementById('difficulty').value;
    resetPanel();       // ui.js — сбросить таймер и кнопку
    createBoard(level); // game.js — создать пустое поле
    placeMines();       // game.js — расставить мины
    countMines();       // game.js — посчитать цифры
    renderBoard();      // board.js — нарисовать клетки
    updateBoard();      // board.js — показать состояние и обновить панель
}

// Запускаем игру сразу при открытии страницы
startGame();

// --- Мобильное приложение: работа без интернета ---
// Подключаем service-worker.js (его пишет Матвей). 
// Работает только на сайте (https), а не при открытии файла с диска.
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('service-worker.js');
}
