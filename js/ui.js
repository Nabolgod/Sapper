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

// --- Выбор уровня сложности ---

const difficultyEl = document.getElementById('difficulty');

// При смене уровня сразу начинаем новую игру
difficultyEl.addEventListener('change', function () {
    startGame();
});

// --- Окно результата (победа / проигрыш) ---

const resultEl = document.getElementById('result');
const resultTitleEl = document.getElementById('result-title');
const resultTextEl = document.getElementById('result-text');
const resultAgainBtn = document.getElementById('result-again');

let resultShown = false; // окно уже показывали в этой игре

// Показывает окно с итогом игры
function showResult() {
    if (game.state === 'won') {
        resultTitleEl.textContent = 'Победа!';
        resultTextEl.textContent = 'Все мины найдены за ' + seconds + ' сек.';
    } else if (game.state === 'lost') {
        resultTitleEl.textContent = 'Проигрыш';
        resultTextEl.textContent = 'Вы подорвались на мине. Попробуйте ещё раз!';
    } else {
        return; // игра уже перезапущена — окно не нужно
    }
    resultEl.hidden = false;
}

// Прячет окно
function hideResult() {
    resultEl.hidden = true;
}

// Следим за игрой: после победы или проигрыша показываем окно (с паузой, чтобы было видно поле)
document.addEventListener('sapper:update', function () {
    if (game.state === 'ready') {
        resultShown = false;
        hideResult();
    }
    if ((game.state === 'won' || game.state === 'lost') && !resultShown) {
        resultShown = true;
        setTimeout(showResult, 600);
    }
});

// Кнопка «Играть ещё»
resultAgainBtn.addEventListener('click', function () {
    hideResult();
    startGame();
});

// Клик по тёмному фону закрывает окно — можно рассмотреть поле
resultEl.addEventListener('click', function (event) {
    if (event.target === resultEl) hideResult();
});