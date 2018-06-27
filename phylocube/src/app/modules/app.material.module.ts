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
    MatFormFieldModule
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
    MatFormFieldModule
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
    MatFormFieldModule
],
})
export class MaterialModule { }
