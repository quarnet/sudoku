import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CellComponent } from './components/cell/cell.component';
import { GridComponent } from './components/grid/grid.component';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';
import { FooterComponent } from './components/footer/footer.component';
import { ControllerComponent } from './components/controller/controller.component';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { SudokuState } from './store/sudoku.store';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    GridComponent,
    HeaderComponent,
    BodyComponent,
    FooterComponent,
    ControllerComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    NgxsModule.forRoot([SudokuState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
