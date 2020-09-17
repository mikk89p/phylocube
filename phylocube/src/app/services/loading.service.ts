import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  public loadingSubject; // Show loading screen with caller text
  private loadingArray = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private zone: NgZone) {
    this.loadingSubject =  new ReplaySubject(1); // new BehaviorSubject([]);
  }

  getLoading() {
    return this.loadingSubject;
  }

  setLoading(id: string, text: string) {
    this.loadingArray.push({id: id, text: text});
    this.loadingSubject.next(this.loadingArray);
  }

  removeLoading(id: string) {

    const loadingRemoved = this.loadingArray.filter(function(el) {
      return el.id !== id;
    });

    this.loadingArray = loadingRemoved;
    this.loadingSubject.next(this.loadingArray);
  }

  openDialog(title: string, description?: string) {

    const dialogConfig = new MatDialogConfig();
    // dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: title,
      description: description
    };

    this.dialog.open(ErrorDialogComponent, dialogConfig);
  }

  openSnackBar(text, duration): void {
    this.zone.run(() => {
      const snackBar = this.snackBar.open(text, 'Close', {
        duration: duration,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
      snackBar.onAction().subscribe(() => {
        snackBar.dismiss();
      });
    });
  }

}
