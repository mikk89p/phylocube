import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import { TaxonomyService } from '../../services/taxonomy.service';
import { Taxon } from '../../services/taxonomy.service';
import { CubeService } from '../../services/cube.service';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-taxonomy-search',
  templateUrl: './taxonomy-search.component.html',
  styleUrls: ['./taxonomy-search.component.scss']
})
export class TaxonomySearchComponent implements OnInit {

  activeResource;
  form: FormGroup;
  // TODO check pattern Validators.pattern('^(?=.*[0-9\s])(?=.*[a-zA-Z\s])([a-zA-Z0-9\s]+)$')
  taxon = new FormControl('', [Validators.required, Validators.minLength(5)]);
  filteredTaxons$: Observable<Taxon[]>;   // $ suffix (popularized by Cycle.js) is used to indicate that the variable is an Observable.

  constructor(
    private cubeService: CubeService,
    private resourceService: ResourceService,
    private taxonomyService: TaxonomyService,
    fb: FormBuilder) {

    this.form = fb.group({
      'taxon': this.taxon
  });

    this.filteredTaxons$ = this.taxon.valueChanges
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

    this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
      },
    );
  }

  private filter(value: string): Observable<Taxon[]> {
    return this.taxonomyService.getTaxons(value)
    .pipe(
      map(response => {
        return this.taxonomyService.format(response, value);
      })
    );
  }

  onSubmit() {
    const arr = this.form.value.taxon.split('|');
    const name = arr[0].trim();
    let taxid = arr[1].trim();
    taxid = Number((taxid.split(':')[1]).trim());
    this.cubeService.setPointsByTaxonomyId(this.activeResource.type, taxid, name);
  }

  highlight() {
    const arr = this.form.value.taxon.split('|');
    const name = arr[0].trim();
    let taxid = arr[1].trim();
    taxid = Number((taxid.split(':')[1]).trim());
    this.cubeService.highlightPointsByTaxonomyId(this.activeResource.type, taxid, name);
  }

  resetDataset() {

  }

}