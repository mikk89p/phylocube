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

  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  resourceSubscription;
  pointsOnCubeSubscription;


  constructor(
    private resourceService: ResourceService,
    private cubeService: CubeService
  ) {}

  ngOnDestroy() {
    this.resourceSubscription.unsubscribe();
    this.pointsOnCubeSubscription.unsubscribe();

  }

  ngOnInit() {
    this.resourceSubscription = this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
      },
    );

    this.pointsOnCubeSubscription = this.cubeService.getSelectedPoint().subscribe(
      point => {
        if (point.x != undefined) {
          this.selectedPoint = point;
        }
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

}
