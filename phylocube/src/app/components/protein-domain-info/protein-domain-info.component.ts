import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService } from '../../services/resource.service';
import { CubeService } from '../../services/cube.service';

@Component({
  selector: 'app-protein-domain-info',
  templateUrl: './protein-domain-info.component.html',
  styleUrls: ['./protein-domain-info.component.scss']
})
export class ProteinDomainInfoComponent implements OnInit, OnDestroy {

  selectedPoint;
  activeResource;
  currentDataSet;
  hideZ = false;

  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  resourceSubscription;
  selectedPointSubscription;
  currentDataSetSubscription;


  constructor(
    private resourceService: ResourceService,
    private cubeService: CubeService
  ) {}

  ngOnDestroy() {
    this.resourceSubscription.unsubscribe();
    this.selectedPointSubscription.unsubscribe();
    this.currentDataSetSubscription.unsubscribe();

  }

  ngOnInit() {
    this.resourceSubscription = this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
        this.selectedPoint = undefined;
      },
    );

    this.currentDataSetSubscription = this.cubeService.getPointsOnCube().subscribe(
      data => {
        const points = data[0];
        this.currentDataSet = points;
      }
    );

    this.selectedPointSubscription = this.cubeService.getSelectedPoint().subscribe(
      point => {
        if (point.x !== undefined) {
          this.selectedPoint = point;
        }
      }
    );

    this.cubeService.getPlotType().subscribe(
      type => {
        this.hideZ = (type === 'scatter') ? true : false;
      }
    );
  }

  openNewTab($event, selectedPoint) {
    const acc = selectedPoint.acc;
    let api_url = this.activeResource.api_url;
    if (this.activeResource.type === 'clanpfam') {
      // https://pfam.xfam.org/clan/;https://pfam.xfam.org/family/
      const res = api_url.split(';');
      if (acc.indexOf('CL') !== -1) {
        api_url = res[0];
      } else {
        api_url = res[1];
      }
    }
    window.open(api_url + acc);
  }

  highlightSelectedPoint() {
    this.currentDataSet.forEach(pointInData => {
      if (pointInData.acc === this.selectedPoint.acc) {
        this.cubeService.setHighlightedPoints([pointInData]);
      }
    });
  }

}
