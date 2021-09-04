import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SudokuMode } from 'src/app/model/app-modals';
import { SudokuState } from 'src/app/store/sudoku.store';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
})
export class BodyComponent implements OnInit, OnDestroy {
  constructor(private store: Store) {}

  @Select(SudokuState.getError) error$?: Observable<string>;
  errorSub?: Subscription;
  error = '';

  @Select(SudokuState.getSudokuMode) sudokuMode$?: Observable<SudokuMode>;
  sudokuModeSub?: Subscription;
  isGameOver = false;
  isGameComplete = false;

  ngOnInit(): void {
    this.errorSub = this.error$?.subscribe((err) => (this.error = err));
    this.sudokuModeSub = this.sudokuMode$?.subscribe((mode) => {
      this.isGameOver = mode === SudokuMode.OVER;
      this.isGameComplete = mode === SudokuMode.FINISHED;
    });
  }

  ngOnDestroy(): void {
    this.errorSub?.unsubscribe();
    this.sudokuModeSub?.unsubscribe();
  }
}
