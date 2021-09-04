export enum SudokuMode {
  NONE = 'none', // initial state
  INIT = 'init', // not started yet
  ACTIVE = 'active', // loaded and not yet finished
  OVER = 'gameOver', // user failed to complete. max failure reached
  FINISHED = 'finished', // user completed or resolved
}

export enum CellType {
  FIX = 'FIX',
  USER = 'user',
  INVALID = 'invalid',
  HELPED = 'helped',
}
export interface ICell {
  value: number;
  x: number;
  y: number;
  color: string;
  type: CellType;
}

export interface IGrid {
  rows: number;
  cols: number;
  cells: ICell[][];
}

export class Cell implements ICell {
  value: number;
  x: number;
  y: number;
  color: string;
  type: CellType;

  constructor(x: number, y: number, type: CellType, value = -1, color = '') {
    this.value = value;
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
  }
}

export class Grid implements IGrid {
  rows: number;
  cols: number;
  cells: ICell[][];

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.cells = [];

    for (let row = 0; row < rows; row++) {
      this.cells[row] = [];
      for (let col = 0; col < cols; col++) {
        this.cells[row][col] = new Cell(row, col, CellType.USER);
      }
    }
  }
}
