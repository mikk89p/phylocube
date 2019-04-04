import { LoadingService } from './../../services/loading.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class TaxonomySearchComponent implements OnInit, OnDestroy {

  activeResource;
  form: FormGroup;
  // TODO check pattern Validators.pattern('^(?=.*[0-9\s])(?=.*[a-zA-Z\s])([a-zA-Z0-9\s]+)$')
  taxon = new FormControl('', [Validators.required, Validators.minLength(5)]);
  filteredTaxons$: Observable<Taxon[]>;   // $ suffix (popularized by Cycle.js) is used to indicate that the variable is an Observable.
  submitted = false;

  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  resourceSubscription;
  taxonomySubscription;


  constructor(
    private cubeService: CubeService,
    private resourceService: ResourceService,
    private loadingService: LoadingService,
    private taxonomyService: TaxonomyService,
    fb: FormBuilder) {

    this.form = fb.group({
      'taxon': this.taxon
  });

    this.filteredTaxons$ = this.taxon.valueChanges
    .pipe( // A pipe takes in data as input and transforms it to a desired output
      debounceTime(150), // Discard emitted values that take less than the specified time between output.
      distinctUntilChanged(), // distinctUntilChanged uses === comparison by default, object references must match
      switchMap(input => { // switch to a new observable
        return this.filter(input);
      })
    );

  }

  ngOnDestroy() {
    this.resourceSubscription.unsubscribe();
    if (this.taxonomySubscription) { this.taxonomySubscription.unsubscribe(); }
  }

  ngOnInit() {

    this.resourceSubscription = this.resourceService.getActiveResource().subscribe(
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

  getTaxId (value: string) {
    const arr = value.split('|');
    if (arr.length > 1) {
      const name = arr[0].trim();
      const taxid = arr[1].trim();
      return {id: Number((taxid.split(':')[1]).trim()), name: name};
    } else {
      return false;
    }
  }
  onSubmit() {
    const tax = this.getTaxId (this.form.value.taxon);

    if (!tax) {
      this.loadingService.openDialog('Error', 'Incorrect input in one of the fields. Please use format [Name | Taxonomy ID: ????]');
      return;
    }

    this.submitted = true;

    if (this.taxonomySubscription) { this.taxonomySubscription.unsubscribe(); }
    // tslint:disable-next-line:max-line-length
    this.taxonomySubscription = this.resourceService.getAccByTaxonomyId(this.activeResource.type, this.activeResource.version, tax.id).subscribe(
      data => {
        if (data.length > 0) {
          this.resourceService.setSearchResult(data);
        } else {
          this.loadingService.openDialog('No domains found from ' + name);
        }
      },
      err => {
        // console.log(err);
        this.submitted = false;
        this.loadingService.openDialog('Error', err.statusText);
      },
      () => { this.submitted = false; }
    );
  }

}
