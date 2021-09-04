import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  Cell,
  CellType,
  Grid,
  ICell,
  IGrid,
  SudokuMode,
} from '../model/app-modals';
import { solve } from '../utils/utils';
import {
  FillCell,
  Help,
  InitSudoku,
  NewSudoku,
  SetActiveCell,
  SetError,
  SetHelpLeft,
  SetHighlightParticipants,
  SetHighlightSimilarCells,
  SetParticipants,
  SetShowAddress,
  SetSimilarCells,
  Solve,
} from './sudoku.actions';

export class SudokuStateModal {
  sudokuGrid?: IGrid;
  resultGrid?: IGrid;
  activeCell?: ICell;
  participants?: ICell[];
  failCount: number = 0;
  allowedAttempts: number = 0;
  highlightParticipants: boolean = false;
  similarCells?: ICell[];
  highLightSimilarCells: boolean = false;
  helpLeft: number = 0;
  showCellAddress: boolean = false;
  error: string = '';
  sudokuMode: SudokuMode = SudokuMode.NONE;
}

@State<SudokuStateModal>({
  name: 'SudokuStateModal',
  defaults: {
    sudokuGrid: new Grid(0, 0),
    resultGrid: new Grid(0, 0),
    activeCell: undefined,
    participants: undefined,
    failCount: 0,
    allowedAttempts: 5,
    highlightParticipants: false,
    similarCells: undefined,
    highLightSimilarCells: true,
    helpLeft: 5,
    showCellAddress: false,
    error: '',
    sudokuMode: SudokuMode.NONE,
  },
})
@Injectable()
export class SudokuState {
  @Selector()
  static getSudokuMode(state: SudokuStateModal) {
    return state.sudokuMode;
  }
  @Selector()
  static getSudokuGrid(state: SudokuStateModal) {
    return state.sudokuGrid;
  }
  @Selector()
  static getResultGrid(state: SudokuStateModal) {
    return state.resultGrid;
  }
  @Selector()
  static getActiveCell(state: SudokuStateModal) {
    return state.activeCell;
  }
  @Selector()
  static getParticipants(state: SudokuStateModal) {
    return state.participants;
  }
  @Selector()
  static getSimilarCells(state: SudokuStateModal) {
    return state.similarCells;
  }
  @Selector()
  static getFailCount(state: SudokuStateModal) {
    return state.failCount;
  }
  @Selector()
  static getAllowedAttempts(state: SudokuStateModal) {
    return state.allowedAttempts;
  }
  @Selector()
  static getIsHighlightParticipants(state: SudokuStateModal) {
    return state.highlightParticipants;
  }
  @Selector()
  static getIsHighlightSimilarCells(state: SudokuStateModal) {
    return state.highLightSimilarCells;
  }
  @Selector()
  static getHelpLeft(state: SudokuStateModal) {
    return state.helpLeft;
  }
  @Selector()
  static getIsShowAddress(state: SudokuStateModal) {
    return state.showCellAddress;
  }
  @Selector()
  static getError(state: SudokuStateModal) {
    return state.error;
  }

  @Action(InitSudoku)
  initSudoku(
    { patchState }: StateContext<SudokuStateModal>,
    { cols, rows }: InitSudoku
  ) {
    const grid = new Grid(rows, cols);
    patchState({
      sudokuGrid: grid,
      sudokuMode: SudokuMode.INIT,
    });
  }

  @Action(SetActiveCell)
  setActiveCell(
    { patchState }: StateContext<SudokuStateModal>,
    { payload }: SetActiveCell
  ) {
    patchState({
      activeCell: payload,
    });
  }

  @Action(NewSudoku)
  newSudoku(
    { patchState }: StateContext<SudokuStateModal>,
    { sudokuCells, resultCells }: NewSudoku
  ) {
    let gridCells: ICell[][] = [];
    let resCells: ICell[][] = [];
    for (let row = 0; row < sudokuCells.length; row++) {
      gridCells[row] = [];
      resCells[row] = [];
      for (let col = 0; col < sudokuCells[row].length; col++) {
        gridCells[row][col] = new Cell(
          row,
          col,
          sudokuCells[row][col] === -1 ? CellType.USER : CellType.FIX,
          sudokuCells[row][col]
        );
        resCells[row][col] = new Cell(
          row,
          col,
          resultCells[row][col] === -1 ? CellType.USER : CellType.FIX,
          resultCells[row][col]
        );
      }
    }

    const grid = new Grid(sudokuCells.length, sudokuCells[0].length);
    grid.cells = gridCells;

    const resultGrid = new Grid(sudokuCells.length, sudokuCells[0].length);
    resultGrid.cells = resCells;

    patchState({
      sudokuGrid: grid,
      resultGrid: resultGrid,
      activeCell: undefined,
      participants: undefined,
      failCount: 0,
      similarCells: undefined,
      helpLeft: 5,
      error: '',
      sudokuMode: SudokuMode.ACTIVE,
    });
  }

  @Action(SetParticipants)
  setParticipants({ getState, patchState }: StateContext<SudokuStateModal>) {
    const participants: ICell[] = [];
    const activeCell = getState().activeCell as ICell;
    const isEnabled = getState().highlightParticipants;

    if (!activeCell || !isEnabled) {
      patchState({
        participants: [],
      });
    } else {
      const row = activeCell.x;
      const col = activeCell.y;
      const grid = getState().sudokuGrid as IGrid;
      for (let i = 0; i < 9; i++) {
        if (col !== i) participants.push(grid.cells[row][i]);
        if (row !== i) participants.push(grid.cells[i][col]);
      }

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const cellRow = Math.floor(row / 3) * 3 + i;
          const cellCol = Math.floor(col / 3) * 3 + j;

          if (row !== cellRow && col !== cellCol)
            participants.push(grid.cells[cellRow][cellCol]);
        }
      }

      patchState({
        participants: participants,
      });
    }
  }

  @Action(SetSimilarCells)
  setSimilarCells({ getState, patchState }: StateContext<SudokuStateModal>) {
    const similarCells: ICell[] = [];
    const activeCell = getState().activeCell as ICell;
    const isEnabled = getState().highLightSimilarCells;
    const row = activeCell.x;
    const col = activeCell.y;
    if (!activeCell || activeCell.value === -1 || !isEnabled) {
      patchState({
        similarCells: [],
      });
    } else {
      const grid = getState().sudokuGrid as IGrid;

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid.cells[i][j].value === activeCell.value)
            similarCells.push(grid.cells[i][j]);
        }
      }

      patchState({
        similarCells: similarCells,
      });
    }
  }

  @Action(Solve)
  solve({ getState, patchState }: StateContext<SudokuStateModal>) {
    if (getState().sudokuMode !== SudokuMode.ACTIVE) return;

    const sourceGrid = getState().sudokuGrid as IGrid;
    const solvedCells = solve(sourceGrid.cells);

    if (solvedCells === false) {
      patchState({
        error: 'No solution found.',
      });
    } else {
      let cells: ICell[][] = [];
      for (let row = 0; row < sourceGrid.cells.length; row++) {
        cells[row] = [];
        for (let col = 0; col < sourceGrid.cells[row].length; col++) {
          let { type, value } = sourceGrid.cells[row][col];

          value = (solvedCells as ICell[][])[row][col].value;
          cells[row][col] = new Cell(row, col, type, value);
        }
      }

      const grid = new Grid(
        sourceGrid.cells.length,
        sourceGrid.cells[0].length
      );
      grid.cells = cells;

      patchState({
        sudokuGrid: grid,
        sudokuMode: SudokuMode.FINISHED,
      });
    }
  }

  @Action(SetError)
  setError(
    { patchState }: StateContext<SudokuStateModal>,
    { message }: SetError
  ) {
    patchState({
      error: message,
    });
  }

  @Action(SetShowAddress)
  setShowAddress(
    { patchState }: StateContext<SudokuStateModal>,
    { payload }: SetShowAddress
  ) {
    patchState({
      showCellAddress: payload,
    });
  }

  @Action(SetHighlightParticipants)
  setHighlightParticipants(
    { patchState }: StateContext<SudokuStateModal>,
    { payload }: SetHighlightParticipants
  ) {
    patchState({
      highlightParticipants: payload,
    });
  }
  @Action(SetHighlightSimilarCells)
  setHighlightSimilarCells(
    { patchState }: StateContext<SudokuStateModal>,
    { payload }: SetHighlightSimilarCells
  ) {
    patchState({
      highLightSimilarCells: payload,
    });
  }
  @Action(SetHelpLeft)
  setHelpLeft(
    { patchState }: StateContext<SudokuStateModal>,
    { payload }: SetHelpLeft
  ) {
    patchState({
      helpLeft: payload,
    });
  }

  @Action(Help)
  help({ patchState, getState }: StateContext<SudokuStateModal>) {
    const { helpLeft, sudokuGrid, resultGrid, sudokuMode } = getState();

    if (sudokuMode !== SudokuMode.ACTIVE) return;

    let helped = false;
    if (helpLeft > 0) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (sudokuGrid?.cells[row][col].value === -1) {
            sudokuGrid.cells[row][col] = new Cell(
              row,
              col,
              CellType.HELPED,
              resultGrid?.cells[row][col].value as number
            );
            helped = true;
            break;
          }
        }
        if (helped) break;
      }

      patchState({
        helpLeft: helpLeft - 1,
        sudokuGrid: sudokuGrid,
      });
    } else {
      patchState({
        error: 'You have exceeded the number of helps.',
      });
    }
  }

  @Action(FillCell)
  fillCell(
    { patchState, getState }: StateContext<SudokuStateModal>,
    { value }: FillCell
  ) {
    const {
      sudokuGrid,
      resultGrid,
      activeCell,
      failCount,
      allowedAttempts,
      sudokuMode,
    } = getState();
    if (sudokuMode !== SudokuMode.ACTIVE) return;
    if (!activeCell) return;
    const cell = activeCell as ICell;
    if (cell.type === CellType.FIX || cell.type === CellType.HELPED) {
      return;
    }

    if (value === -1) {
      (sudokuGrid as IGrid).cells[cell.x][cell.y] = new Cell(
        cell.x,
        cell.y,
        CellType.USER,
        -1
      );

      patchState({
        sudokuGrid: sudokuGrid,
      });
    } else {
      const isValid = resultGrid?.cells[cell.x][cell.y].value === value;
      (sudokuGrid as IGrid).cells[cell.x][cell.y] = new Cell(
        cell.x,
        cell.y,
        isValid ? CellType.USER : CellType.INVALID,
        value
      );

      const newFailCount = !isValid ? failCount + 1 : failCount;
      const newMode =
        newFailCount < allowedAttempts ? sudokuMode : SudokuMode.OVER;

      patchState({
        sudokuGrid: sudokuGrid,
        failCount: newFailCount,
        sudokuMode: newMode,
      });
    }
  }
}
