// touch.js — управление касаниями: тап — открыть, долгое нажатие — флажок. Автор: Данил Корчагин

const LONG_PRESS_MS = 400; // сколько держать палец для флажка (в миллисекундах)

let pressTimer = null;     // таймер долгого нажатия
let longPressDone = false; // флажок уже поставлен этим нажатием
let lastTouchTime = 0;     // когда последний раз касались экрана
let startX = 0;
let startY = 0;

// Палец коснулся клетки — запускаем отсчёт долгого нажатия
boardElement.addEventListener('touchstart', function (event) {
  const el = event.target.closest('.cell');
  if (!el) return;

  lastTouchTime = Date.now();
  longPressDone = false;
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;

  pressTimer = setTimeout(function () {
    longPressDone = true;
    handleFlag(Number(el.dataset.row), Number(el.dataset.col));
    if (navigator.vibrate) navigator.vibrate(30); // короткая вибрация, если телефон умеет
  }, LONG_PRESS_MS);
}, { passive: true });

// Палец сдвинулся (человек прокручивает поле) — это не нажатие
boardElement.addEventListener('touchmove', function (event) {
  const dx = Math.abs(event.touches[0].clientX - startX);
  const dy = Math.abs(event.touches[0].clientY - startY);
  if (dx > 10 || dy > 10) cancelPress();
}, { passive: true });

// Палец отпустили
boardElement.addEventListener('touchend', function (event) {
  cancelPress();
  // После долгого нажатия не даём браузеру превратить его в обычный клик (иначе клетка откроется)
  if (longPressDone) event.preventDefault();
}, { passive: false });

boardElement.addEventListener('touchcancel', cancelPress);

// Android сам превращает долгое нажатие в «правый клик» — гасим его, чтобы флажок не ставился дважды
boardElement.addEventListener('contextmenu', function (event) {
  if (Date.now() - lastTouchTime < 1500) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);

// Отменяет отсчёт долгого нажатия
function cancelPress() {
  clearTimeout(pressTimer);
  pressTimer = null;
}