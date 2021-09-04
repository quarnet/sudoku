# About Sudoku

A classic 9x9 Sudoku generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.2.
The implementation supports the generation of a new 9x9 Sudoku, resolving the same with few additional features like, Help (to fill the first blank cell), invalid step detection, similar cell highlighting, and neighbour cell highlighting.

The backtracking/recursive algorithm is used for generating and/or resolving the Sudoku.

## Deploy

Branch: master <br />
Command: ng build --prod --baseHref="https://quarnet.github.io/sudoku/"

## Demo

[Sudoku](https://quarnet.github.io/sudoku/)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
