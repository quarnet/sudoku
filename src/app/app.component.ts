import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { InitSudoku } from './store/sudoku.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  title = 'sudoku';

  ngOnInit(): void {
    this.store.dispatch(new InitSudoku(9, 9));
  }
}
