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
    MatSliderModule
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
    MatSliderModule
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
    MatSliderModule
],
})
export class MaterialModule { }
