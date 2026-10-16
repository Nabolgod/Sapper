// board.js — отрисовка поля на странице и клики мышью. Автор: Матвей Канашин

// Рисует поле: создаёт элемент для каждой клетки
function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  boardEl.style.setProperty('--cols', game.cols);

  for (const line of game.cells) {
    for (const cell of line) {
      const el = document.createElement('div');
      el.className = 'cell';
      el.dataset.row = cell.row;
      el.dataset.col = cell.col;
      cell.el = el;
      boardEl.appendChild(el);
    }
  }
}

// Обновляет вид одной клетки по её состоянию
function updateCell(cell) {
  const el = cell.el;
  el.className = 'cell';
  el.removeAttribute('data-count');
  if (cell.open) {
    el.classList.add('open');
    if (cell.mine) {
      el.classList.add('mine');
    } else if (cell.count > 0) {
      el.dataset.count = cell.count;
    }
  } else if (cell.flag) {
    el.classList.add('flag');
  }
}

// Обновляет всё поле и сообщает интерфейсу, что игра изменилась
function updateBoard() {
  for (const line of game.cells) {
    for (const cell of line) updateCell(cell);
  }
  document.dispatchEvent(new CustomEvent('sapper:update'));
}

// Действие «открыть клетку» — для мыши и для касаний
function handleOpen(row, col) {
  openCell(row, col);
  if (game.state === 'lost') revealMines();
  checkWin();
  updateBoard();
}

// Действие «поставить/снять флажок» — для мыши и для касаний
function handleFlag(row, col) {
  toggleFlag(row, col);
  updateBoard();
}

// Управление мышью
const boardElement = document.getElementById('board');

// Левая кнопка — открыть клетку
boardElement.addEventListener('click', function (event) {
  const el = event.target.closest('.cell');
  if (!el) return;
  handleOpen(Number(el.dataset.row), Number(el.dataset.col));
});

// Правая кнопка — флажок
boardElement.addEventListener('contextmenu', function (event) {
  event.preventDefault(); // не показываем меню браузера
  const el = event.target.closest('.cell');
  if (!el) return;
  handleFlag(Number(el.dataset.row), Number(el.dataset.col));
});
