import { ResourceService } from './../../services/resource.service';
import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
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




  filteredTaxonsX$: Observable<Taxon[]>;   // $ suffix (popularized by Cycle.js) is used to indicate that the variable is an Observable.
  taxonX = new FormControl('Viridiplantae | Taxonomy ID: 33090', [Validators.required, Validators.minLength(5)]);

  taxonY = new FormControl('Vertebrata | Taxonomy ID: 7742', [Validators.required, Validators.minLength(5)]);
  filteredTaxonsY$: Observable<Taxon[]>;

  taxonZ = new FormControl('Saccharomycetales | Taxonomy ID: 4892', [Validators.required, Validators.minLength(5)]);
  filteredTaxonsZ$: Observable<Taxon[]>;

  form;


  constructor(
    private resourceService: ResourceService,
    private taxonomyService: TaxonomyService,
    private fb: FormBuilder) {

    // FormBuilder makes form development and maintenance easier.
    this.form = this.fb.group({
      taxonX: this.taxonX,
      taxonY: this.taxonY,
      taxonZ: this.taxonZ
    });

    this.filteredTaxonsX$ = this.taxonX.valueChanges
    .pipe( // A pipe takes in data as input and transforms it to a desired output
      debounceTime(200), // Discard emitted values that take less than the specified time between output.
      distinctUntilChanged(), // distinctUntilChanged uses === comparison by default, object references must match
      switchMap(input => { // switch to a new observable
        return this.filter(input);
      })
    );

    this.filteredTaxonsY$ = this.taxonY.valueChanges
    .pipe( // A pipe takes in data as input and transforms it to a desired output
      debounceTime(200), // Discard emitted values that take less than the specified time between output.
      distinctUntilChanged(), // distinctUntilChanged uses === comparison by default, object references must match
      switchMap(input => { // switch to a new observable
        return this.filter(input);
      })
    );

    this.filteredTaxonsZ$ = this.taxonZ.valueChanges
    .pipe( // A pipe takes in data as input and transforms it to a desired output
      debounceTime(200), // Discard emitted values that take less than the specified time between output.
      distinctUntilChanged(), // distinctUntilChanged uses === comparison by default, object references must match
      switchMap(input => { // switch to a new observable
        return this.filter(input);
      })
    );


  }

  ngOnInit() {
  }

  getTaxId (value: string) {
    const arr = value.split('|');
    const name = arr[0].trim();
    const taxid = arr[1].trim();
    return {id: Number((taxid.split(':')[1]).trim()), name: name};
  }

  onSubmit() {
    const taxX = this.getTaxId (this.form.controls.taxonX.value);
    const taxY = this.getTaxId (this.form.controls.taxonY.value);
    const taxZ = this.getTaxId (this.form.controls.taxonZ.value);
    this.resourceService.setAxesByTaxonomyId(taxX.id, taxX.name, taxY.id, taxY.name, taxZ.id, taxZ.name);
  }

  filter(value: string): Observable<Taxon[]> {
    return this.taxonomyService.getTaxons(value)
    .pipe(
      map(response => {
        return this.taxonomyService.format(response, value);
      })
    );
  }







}
