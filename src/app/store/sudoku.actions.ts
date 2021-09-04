import { ICell } from '../model/app-modals';

export class InitSudoku {
  static readonly type = '[sudoku] init sudoku';

  constructor(public rows: number, public cols: number) {}
}

export class SetActiveCell {
  static readonly type = '[sudoku] set active cell';

  constructor(public payload: ICell) {}
}

export class NewSudoku {
  static readonly type = '[sudoku] new sudoku';

  constructor(public sudokuCells: number[][], public resultCells: number[][]) {}
}

export class Solve {
  static readonly type = '[sudoku] solve';

  constructor() {}
}

export class SetParticipants {
  static readonly type = '[sudoku] participants';

  constructor() {}
}

export class SetSimilarCells {
  static readonly type = '[sudoku] similar cells';

  constructor() {}
}

export class SetError {
  static readonly type = '[sudoku] error';

  constructor(public message: string) {}
}

export class SetShowAddress {
  static readonly type = '[sudoku] show address';

  constructor(public payload: boolean) {}
}
export class SetHighlightParticipants {
  static readonly type = '[sudoku] highlight participants';

  constructor(public payload: boolean) {}
}

export class SetHighlightSimilarCells {
  static readonly type = '[sudoku] highlight similar cells';

  constructor(public payload: boolean) {}
}

export class SetHelpLeft {
  static readonly type = '[sudoku] help left';

  constructor(public payload: number) {}
}

export class Help {
  static readonly type = '[sudoku] help';

  constructor() {}
}

export class FillCell {
  static readonly type = '[sudoku] fill cell';

  constructor(public value: number) {}
}
