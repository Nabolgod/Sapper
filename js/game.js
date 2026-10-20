// game.js — игровая логика: поле, мины, цифры, открытие клеток, флажки. Автор: Матвей Канашин

// --- Создание поля и расстановка мин ---

// Уровни сложности: размер поля и количество мин
const LEVELS = {
  easy:   { rows: 9,  cols: 9,  mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard:   { rows: 16, cols: 30, mines: 99 }
};

// Состояние текущей игры
const game = {
  rows: 0,
  cols: 0,
  mines: 0,
  cells: [],       // клетки поля: game.cells[строка][столбец]
  state: 'ready',  // ready — ждём первый ход, playing — игра идёт, won — победа, lost — поражение
  flags: 0,        // сколько флажков поставлено
  opened: 0        // сколько клеток открыто
};

// Создаёт пустое поле выбранного уровня
function createBoard(level) {
  const settings = LEVELS[level] || LEVELS.easy;
  game.rows = settings.rows;
  game.cols = settings.cols;
  game.mines = settings.mines;
  game.state = 'ready';
  game.flags = 0;
  game.opened = 0;
  game.cells = [];

  for (let row = 0; row < game.rows; row++) {
    const line = [];
    for (let col = 0; col < game.cols; col++) {
      line.push({ row: row, col: col, mine: false, open: false, flag: false, count: 0 });
    }
    game.cells.push(line);
  }
}

// Случайно расставляет мины по полю
function placeMines() {
  let placed = 0;
  while (placed < game.mines) {
    const row = Math.floor(Math.random() * game.rows);
    const col = Math.floor(Math.random() * game.cols);
    const cell = game.cells[row][col];
    if (!cell.mine) {
      cell.mine = true;
      placed++;
    }
  }
}

// --- Подсчёт мин вокруг клеток ---

// Возвращает соседние клетки (до 8 штук)
function getNeighbors(row, col) {
  const neighbors = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < game.rows && c >= 0 && c < game.cols) {
        neighbors.push(game.cells[r][c]);
      }
    }
  }
  return neighbors;
}

// Для каждой клетки считает, сколько мин вокруг неё
function countMines() {
  for (const line of game.cells) {
    for (const cell of line) {
      cell.count = getNeighbors(cell.row, cell.col).filter(function (n) { return n.mine; }).length;
    }
  }
}


// --- Открытие клеток и авто-раскрытие ---

// Открывает клетку. Если вокруг неё нет мин — по цепочке открывает соседей
function openCell(row, col) {
  if (game.state === 'won' || game.state === 'lost') return;
  const start = game.cells[row][col];
  if (start.open || start.flag) return;

  if (game.state === 'ready') startFirstMove(row, col);

  if (start.mine) {
    start.open = true;
    game.state = 'lost';
    return;
  }

  const queue = [start];
  while (queue.length > 0) {
    const cell = queue.shift();
    if (cell.open || cell.flag) continue;
    cell.open = true;
    game.opened++;
    if (cell.count === 0) {
      for (const n of getNeighbors(cell.row, cell.col)) {
        if (!n.open && !n.flag && !n.mine) queue.push(n);
      }
    }
  }
}


// --- Флажки, победа и поражение ---

// Ставит или снимает флажок на закрытой клетке
function toggleFlag(row, col) {
  if (game.state === 'won' || game.state === 'lost') return;
  const cell = game.cells[row][col];
  if (cell.open) return;
  cell.flag = !cell.flag;
  game.flags += cell.flag ? 1 : -1;
}

// Проверяет победу: открыты все клетки без мин
function checkWin() {
  if (game.state !== 'playing') return;
  if (game.opened === game.rows * game.cols - game.mines) {
    game.state = 'won';
    for (const line of game.cells) {
      for (const cell of line) {
        if (cell.mine && !cell.flag) {
          cell.flag = true;
          game.flags++;
        }
      }
    }
  }
}

// После поражения показывает все мины
function revealMines() {
  for (const line of game.cells) {
    for (const cell of line) {
      if (cell.mine) cell.open = true;
    }
  }
}

// --- Безопасный первый ход ---

// Первый ход: убираем мины с клетки и её соседей и расставляем их заново в другом месте.
// Так первый клик всегда открывает свободную область.
function startFirstMove(row, col) {
    const safeZone = [game.cells[row][col]].concat(getNeighbors(row, col));

// Снимаем все мины
    for (const line of game.cells) {
        for (const cell of line) cell.mine = false;
    }

    // Расставляем заново, обходя безопасную зону
    let placed = 0;
    while (placed < game.mines) {
        const r = Math.floor(Math.random() * game.rows);
        const c = Math.floor(Math.random() * game.cols);
        const cell = game.cells[r][c];
        if (!cell.mine && !safeZone.includes(cell)) {
            cell.mine = true;
            placed++;
        }
    }
    countMines();
    game.state = 'playing';
}