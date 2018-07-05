import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CubeService } from '../../services/cube.service';
import { LoadingService } from '../../services/loading.service';
import { ResourceService } from '../../services/resource.service';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy {

  activeResource;
  pointsOnCube;
  showLoading = false;
  accessionCount = 0;
  form: FormGroup;

  proteinDomainsInput = new FormControl('', [Validators.required, Validators.minLength(5)]);

  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  pointsOnCubeSubscription;

  constructor(
    private cubeService: CubeService,
    private loadingService: LoadingService,
    private resourceService: ResourceService,
    private fb: FormBuilder) {

    this.form = fb.group({
      'proteinDomainsInput': this.proteinDomainsInput
    });

    this.proteinDomainsInput.valueChanges.subscribe(
      data => {
        this.setAccessionCount(data);
    });


    this.resourceService.getSearchResult().subscribe(
      data => {
        if (data != undefined) {
          if (data.length > 0) {
            console.log(data);
            this.proteinDomainsInput.setValue(data.join(','));
          } else {
            this.loadingService.openDialog('Message', 'No results');
            this.proteinDomainsInput.setValue('');
          }
        }
      }
    );

  }

  ngOnDestroy() {
    this.pointsOnCubeSubscription.unsubscribe();
  }

  ngOnInit() {

    this.pointsOnCubeSubscription = this.cubeService.getPointsOnCube().subscribe(
      points => {
        this.pointsOnCube = points;
      }
    );
  }

  setAccessionCount(data: string): void {
    let count = 0;
    const points = data.split(',');
    points.forEach(point => {
      if (point != '') { count += 1; }
    });

    this.accessionCount = count;
  }

  getPointsFromCube() {
    let result = '';
    this.pointsOnCube.forEach(point => {
      result += point.acc + ',';
    });
    this.proteinDomainsInput.setValue(result);
  }

  onSubmit() {

    // this.showLoading = true;
    // const start = new Date().getMilliseconds();
    const accessions = this.proteinDomainsInput.value.split(',');
    const resultPoints = [];
    this.pointsOnCube.forEach(point => {
    if (accessions.includes(point.acc) ) {
        resultPoints.push(point);
      }
    });
    // tslint:disable-next-line:triple-equals
    if (resultPoints.length == 0) {
      this.loadingService.openDialog('Message', 'Current dataset did not have protein domains with provided accessions');
    } else {
      this.cubeService.setFullData(resultPoints);
    }
    // const comp = this;
    // setTimeout(function() {comp.showLoading = false; }, 800 - start);
  }

  highlight() {
    const accessions = this.proteinDomainsInput.value.split(',');
    const resultPoints = [];
    this.pointsOnCube.forEach(point => {
      if (accessions.includes(point.acc) ) {
        resultPoints.push(point);
      }
    });
    this.cubeService.setHighlightedPoints(resultPoints, 'selection');
  }
}
