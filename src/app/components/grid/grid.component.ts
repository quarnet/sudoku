import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Grid, IGrid } from 'src/app/model/app-modals';
import { SudokuState } from 'src/app/store/sudoku.store';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnDestroy {
  @Select(SudokuState.getSudokuGrid) gridMetricsObs?: Observable<IGrid>;
  gridSubscription?: Subscription;

  gridMetrics?: IGrid = new Grid(9, 9);

  constructor() {}

  ngOnInit(): void {
    this.gridSubscription = this.gridMetricsObs?.subscribe((grid) => {
      if (!grid) return;

      this.gridMetrics = grid;
    });
  }

  ngOnDestroy(): void {
    this.gridSubscription?.unsubscribe();
  }
}
