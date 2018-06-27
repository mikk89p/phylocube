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
    MatPaginatorModule
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
    MatPaginatorModule
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
    MatPaginatorModule
],
})
export class MaterialModule { }
