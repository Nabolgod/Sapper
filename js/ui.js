// ui.js — панель игры: счётчик мин, таймер, выбор сложности, окна. Автор: Данил Лобанов

// --- Панель: счётчик мин, таймер, кнопка «Новая игра» ---

const minesCounterEl = document.getElementById('mines-counter');
const timerEl = document.getElementById('timer');
const newGameBtn = document.getElementById('new-game');

let seconds = 0;
let timerId = null;

// Показывает число тремя цифрами: 7 → 007
function formatNumber(value) {
    const n = Math.max(0, Math.min(999, value));
    return String(n).padStart(3, '0');
}

// Запускает таймер (если он ещё не идёт)
function startTimer() {
    if (timerId !== null) return;
    timerId = setInterval(function () {
        seconds++;
        timerEl.textContent = formatNumber(seconds);
    }, 1000);
}

// Останавливает таймер
function stopTimer() {
    clearInterval(timerId);
    timerId = null;
}

// Сбрасывает панель перед новой игрой
function resetPanel() {
    stopTimer();
    seconds = 0;
    timerEl.textContent = formatNumber(0);
    newGameBtn.textContent = 'Новая игра';
}

// Обновляет панель после каждого хода
function updatePanel() {
    minesCounterEl.textContent = formatNumber(game.mines - game.flags);

    if (game.state === 'playing') startTimer();

    if (game.state === 'won') {
        stopTimer();
        newGameBtn.textContent = 'Победа! Ещё раз';
    }
    if (game.state === 'lost') {
        stopTimer();
        newGameBtn.textContent = 'Проигрыш. Ещё раз';
    }
}

// board.js сообщает, что в игре что-то изменилось
document.addEventListener('sapper:update', updatePanel);

// Кнопка «Новая игра»
newGameBtn.addEventListener('click', function () {
    startGame();
});