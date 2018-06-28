import { NgModule } from '@angular/core';

import {
   MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatGridListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatAutocompleteModule
} from '@angular/material';

@NgModule({
  imports: [
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatGridListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatAutocompleteModule
],
  exports: [
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatGridListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatAutocompleteModule
],
})
export class MaterialModule { }
