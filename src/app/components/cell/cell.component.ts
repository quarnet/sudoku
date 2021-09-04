import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { CellType, ICell } from 'src/app/model/app-modals';
import {
  SetActiveCell,
  SetParticipants,
  SetSimilarCells,
} from 'src/app/store/sudoku.actions';
import { SudokuState } from 'src/app/store/sudoku.store';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
})
export class CellComponent implements OnInit, OnDestroy {
  @Input() cell?: ICell;

  constructor(private store: Store) {}

  @Select(SudokuState.getActiveCell) activeCell?: Observable<ICell>;
  activeCellSubscription?: Subscription;

  @Select(SudokuState.getParticipants) participants?: Observable<ICell[]>;
  participantsSubscription?: Subscription;

  @Select(SudokuState.getSimilarCells) similarCells?: Observable<ICell[]>;
  similarCellsSubscription?: Subscription;

  @Select(SudokuState.getIsShowAddress) showAddress$?: Observable<boolean>;
  showAddressSubscription?: Subscription;
  showAddress = false;

  isActive = false;
  showBorderRight = false;
  showBorderBottom = false;
  isFixed = false;
  isUserCell = false;
  isParticipantCell = false;
  isSimilarCell = false;

  isHelped = false;
  isInvalid = false;

  cellClick() {
    this.store.dispatch(new SetActiveCell(this.cell as ICell));
    this.store.dispatch(new SetParticipants());
    this.store.dispatch(new SetSimilarCells());
  }

  ngOnInit(): void {
    this.showAddressSubscription = this.showAddress$?.subscribe((flag) => {
      this.showAddress = flag;
    });

    this.activeCellSubscription = this.activeCell?.subscribe((cell) => {
      if (!cell) return;
      this.isActive = cell.x === this.cell?.x && cell.y === this.cell?.y;
    });

    this.participantsSubscription = this.participants?.subscribe((cells) => {
      if (!cells) return;
      this.isParticipantCell = !!cells.find(
        (cell) => cell.x === this.cell?.x && cell.y === this.cell?.y
      );
    });

    this.similarCellsSubscription = this.similarCells?.subscribe((cells) => {
      if (!cells) return;
      this.isSimilarCell = !!cells.find(
        (cell) => cell.x === this.cell?.x && cell.y === this.cell?.y
      );
    });

    if (this.cell) {
      const _cell = this.cell as ICell;
      this.showBorderRight = (_cell.y + 1) % 3 === 0;
      this.showBorderBottom = (_cell.x + 1) % 3 === 0;

      if (_cell.x === 8) this.showBorderBottom = false;
      if (_cell.y === 8) this.showBorderRight = false;

      this.isFixed = _cell.type === CellType.FIX;
      this.isUserCell = _cell.type === CellType.USER;
      this.isHelped = _cell.type === CellType.HELPED;
      this.isInvalid = _cell.type === CellType.INVALID;
    }
  }

  ngOnDestroy(): void {
    this.activeCellSubscription?.unsubscribe();
    this.participantsSubscription?.unsubscribe();
    this.similarCellsSubscription?.unsubscribe();
    this.showAddressSubscription?.unsubscribe();
  }
}
