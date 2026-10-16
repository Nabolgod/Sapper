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
