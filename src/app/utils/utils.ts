import { Cell, CellType, ICell } from '../model/app-modals';

export const solve = (grid: ICell[][]): ICell[][] | boolean => {
  let sourceData: number[][] = [];
  for (let row = 0; row < grid.length; row++) {
    sourceData[row] = [];
    for (let col = 0; col < grid[row].length; col++) {
      sourceData[row][col] = grid[row][col].value;
    }
  }

  if (solveSudoku(sourceData, 0, 0)) {
    let res: ICell[][] = [];
    for (let row = 0; row < grid.length; row++) {
      res[row] = [];
      for (let col = 0; col < grid[row].length; col++) {
        res[row][col] = new Cell(row, col, CellType.USER, sourceData[row][col]);
      }
    }
    return res;
  }

  return false;
};

const isValid = (
  cells: number[][],
  row: number,
  col: number,
  value: number
): boolean => {
  for (let i = 0; i < cells.length; i++) {
    if (cells[row][i] === value && i !== col) return false;
    if (cells[i][col] === value && i !== row) return false;
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cellRow = Math.floor(row / 3) * 3 + i;
      const cellCol = Math.floor(col / 3) * 3 + j;
      if (cells[cellRow][cellCol] === value && i !== row && j !== col)
        return false;
    }
  }

  return true;
};

const solveSudoku = (cells: number[][], row: number, col: number): boolean => {
  if (row === cells.length - 1 && col === cells[0].length) return true;

  if (col === cells[0].length) {
    col = 0;
    row++;
  }

  if (cells[row][col] !== -1) return solveSudoku(cells, row, col + 1);

  for (let k = 1; k <= 9; k++) {
    if (isValid(cells, row, col, k)) {
      cells[row][col] = k;

      if (solveSudoku(cells, row, col + 1)) return true;
    }
    cells[row][col] = -1;
  }

  return false;
};

const getBlankSudoku = () => {
  const cells: number[][] = [];
  for (let row = 0; row < 9; row++) {
    cells[row] = [];
    for (let col = 0; col < 9; col++) {
      cells[row][col] = -1;
    }
  }
  return cells;
};

export const generateNewSudoku = (): [boolean, number[][], number[][]] => {
  const MAX_GENERATION_ATTEMPTS = 20; // to prevent long running task probably reach to infinity.
  const MAX_CELL_GENERATION_ATTEMPTS = 20; // if you dont find a valid value for the cell, then preent more attempts and go to the next cell
  const CELLS_TO_GENERATE = 25; // Use this to set difficulty levels
  let [sudokuGenerated, generationAttempt] = [false, 0];
  let sudokuCells: number[][];
  let resultCells: number[][];

  do {
    sudokuCells = getBlankSudoku();
    resultCells = getBlankSudoku();
    let foundCellsCount = 0;
    while (foundCellsCount < CELLS_TO_GENERATE) {
      const rowPosition = Math.floor(Math.random() * 10) % 9;
      const colPosition = Math.floor(Math.random() * 10) % 9;

      // if the position is already filled, then continue
      if (sudokuCells[rowPosition][colPosition] !== -1) continue;

      let [value, validValueFound, validAttempt] = [0, false, 0];

      do {
        value = (Math.floor(Math.random() * 10) % 8) + 1;
        validValueFound = isValid(sudokuCells, rowPosition, colPosition, value);
      } while (
        !validValueFound &&
        ++validAttempt < MAX_CELL_GENERATION_ATTEMPTS
      );

      if (validValueFound) {
        sudokuCells[rowPosition][colPosition] = value;
        resultCells[rowPosition][colPosition] = value;
        foundCellsCount++;
      }
    }

    if (solveSudoku(resultCells, 0, 0)) {
      sudokuGenerated = true;
    }
  } while (!sudokuGenerated && ++generationAttempt < MAX_GENERATION_ATTEMPTS);

  return [sudokuGenerated, sudokuCells, resultCells];
};
