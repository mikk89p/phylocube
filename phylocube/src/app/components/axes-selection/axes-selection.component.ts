import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import { TaxonomyService } from '../../services/taxonomy.service';
import { Taxon } from '../../services/taxonomy.service';


@Component({
  selector: 'app-axes-selection',
  templateUrl: './axes-selection.component.html',
  styleUrls: ['./axes-selection.component.scss']
})
export class AxesSelectionComponent implements OnInit {
  taxonCtrlX = new FormControl();
  filteredTaxonsX$: Observable<Taxon[]>;   // $ suffix (popularized by Cycle.js) is used to indicate that the variable is an Observable.
  
  taxonCtrlY = new FormControl();
  filteredTaxonsY$: Observable<Taxon[]>;
  

  submitted = false;
  model: any = {};


  constructor(private taxonomyService: TaxonomyService) {

    this.filteredTaxonsX$ = this.taxonCtrlX.valueChanges
    .pipe( // A pipe takes in data as input and transforms it to a desired output
      startWith(null), // Emits given value first
      debounceTime(200), // Discard emitted values that take less than the specified time between output.
      distinctUntilChanged(), // distinctUntilChanged uses === comparison by default, object references must match
      switchMap(input => { // switch to a new observable
        return this.filter(input);
      })
    );

    this.filteredTaxonsY$ = this.taxonCtrlY.valueChanges
    .pipe( // A pipe takes in data as input and transforms it to a desired output
      startWith(null), // Emits given value first
      debounceTime(200), // Discard emitted values that take less than the specified time between output.
      distinctUntilChanged(), // distinctUntilChanged uses === comparison by default, object references must match
      switchMap(input => { // switch to a new observable
        return this.filter(input);
      })
    );


  }

  ngOnInit() {
  }

  dataChanged(event) {
    console.log("---"+event);
  }

  onSubmit() {
    console.log(this.model);
    this.submitted = true; }

  private filter(value: string): Observable<Taxon[]> {
    return this.taxonomyService.getTaxons(value)
    .pipe(
      map(response => {
        return this.taxonomyService.format(response, value);
      })
    );
  }







}
