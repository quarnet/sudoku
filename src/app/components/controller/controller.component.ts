import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import {
  FillCell,
  Help,
  NewSudoku,
  SetError,
  SetHighlightParticipants,
  SetHighlightSimilarCells,
  SetParticipants,
  SetShowAddress,
  SetSimilarCells,
  Solve,
} from 'src/app/store/sudoku.actions';
import { SudokuState } from 'src/app/store/sudoku.store';
import { generateNewSudoku } from 'src/app/utils/utils';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
})
export class ControllerComponent implements OnInit, OnDestroy {
  constructor(private store: Store) {}

  numbers = [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  @Select(SudokuState.getHelpLeft)
  helpLeft$?: Observable<number>;
  helpLeftSub?: Subscription;
  helpLeft: number = 0;

  @Select(SudokuState.getFailCount)
  failCount$?: Observable<number>;
  failCountSub?: Subscription;
  attemptLeft = 0;

  @Select(SudokuState.getIsHighlightParticipants)
  highlightParticipants$?: Observable<boolean>;
  highlightParticipantsSub?: Subscription;
  highlightParticipants: boolean = false;

  @Select(SudokuState.getIsHighlightSimilarCells)
  highlightSimilarCells$?: Observable<boolean>;
  highlightSimilarCellsSub?: Subscription;
  highlightSimilarCells: boolean = false;

  @Select(SudokuState.getIsShowAddress)
  showAddress$?: Observable<boolean>;
  showAddressSub?: Subscription;
  showAddress: boolean = false;

  onNewSudoku() {
    const [isSuccess, cells, result] = generateNewSudoku();

    if (isSuccess) {
      this.store.dispatch(new NewSudoku(cells, result));
    } else {
      this.store.dispatch(
        new SetError('Failed to generate new Sudoku. Please try again.')
      );
    }
  }

  onSolve() {
    this.store.dispatch(new Solve());
  }

  onHelp() {
    this.store.dispatch(new Help());
  }

  fillCell(val: number) {
    this.store.dispatch(new FillCell(val));
  }

  onParticipantsClick() {
    this.store.dispatch(
      new SetHighlightParticipants(!this.highlightParticipants)
    );
    this.store.dispatch(new SetParticipants());
  }

  onSimilarCellClick() {
    this.store.dispatch(
      new SetHighlightSimilarCells(!this.highlightSimilarCells)
    );
    this.store.dispatch(new SetSimilarCells());
  }

  onShowAddressClick() {
    this.store.dispatch(new SetShowAddress(!this.showAddress));
  }

  ngOnInit(): void {
    this.highlightParticipantsSub = this.highlightParticipants$?.subscribe(
      (flag) => {
        this.highlightParticipants = flag;
      }
    );

    this.helpLeftSub = this.helpLeft$?.subscribe((flag) => {
      this.helpLeft = flag;
    });

    this.failCountSub = this.failCount$?.subscribe((flag) => {
      this.attemptLeft = 5 - flag;
    });

    this.highlightSimilarCellsSub = this.highlightSimilarCells$?.subscribe(
      (flag) => {
        this.highlightSimilarCells = flag;
      }
    );

    this.showAddressSub = this.showAddress$?.subscribe((flag) => {
      this.showAddress = flag;
    });
  }

  ngOnDestroy(): void {
    this.highlightParticipantsSub?.unsubscribe();
    this.highlightSimilarCellsSub?.unsubscribe();
    this.showAddressSub?.unsubscribe();
    this.helpLeftSub?.unsubscribe();
    this.failCountSub?.unsubscribe();
  }
}
