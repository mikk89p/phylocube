import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  public loadingSubject; // Show loading screen with caller text
  private loadingArray = [];

  constructor() {
    this.loadingSubject =  new BehaviorSubject([]);
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

}
