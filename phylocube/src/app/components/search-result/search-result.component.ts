import { Component, OnInit } from '@angular/core';
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
export class SearchResultComponent implements OnInit {

  activeResource;
  showLoading = false;
  accessionCount = 0;
  form: FormGroup;

  proteinDomainsInput = new FormControl('', [Validators.required, Validators.minLength(5)]);

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
        if (data.length != undefined  && data.length > 0) {
          this.proteinDomainsInput.setValue(data.join(','));
        } else {
          this.proteinDomainsInput.setValue('');
        }

      }
    );

  }

  ngOnInit() {
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
    this.showLoading = true;
    const subscription = this.cubeService.getPointsOnCube().subscribe(
      points => {
        this.showLoading = false;
        let result = '';
        points.forEach(point => {
          result += point.acc + ',';
        });
        this.proteinDomainsInput.setValue(result);
      }
    );
    subscription.unsubscribe();
  }

  onSubmit() {
    /*
    117070,161070,103378,74853,101478,89733,49478,52309,58100,160104,49344,141130,49373,*/
    this.showLoading = true;
    const start = new Date().getMilliseconds();
    const accessions = this.proteinDomainsInput.value.split(',');
    const subscription = this.cubeService.getPointsOnCube().subscribe(
      points => {
        const resultPoints = [];
        points.forEach(point => {
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
        const comp = this;
        setTimeout(function() {comp.showLoading = false; }, 800 - start);

      },
      err => {
        this.loadingService.openDialog('Error', err.statusText);
      }
    );

    subscription.unsubscribe();
  }

  highlight() {
    this.loadingService.setLoading('search-result_highlight', 'In progress' );
    const accessions = this.proteinDomainsInput.value.split(',');
    const subscription = this.cubeService.getPointsOnCube().subscribe(
      points => {
        this.showLoading = false;
        const resultPoints = [];
        points.forEach(point => {
          if (accessions.includes(point.acc) ) {
            resultPoints.push(point);
          }
        });
        this.cubeService.setHighlightedPoints(resultPoints, 'selection');
        this.loadingService.removeLoading('search-result_highlight');
      },
      err => {
        this.loadingService.removeLoading('search-result_highlight');
        this.loadingService.openDialog('Error', err.statusText);
      }
    );

    subscription.unsubscribe();
  }

}
