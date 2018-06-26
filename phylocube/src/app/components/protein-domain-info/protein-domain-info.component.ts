import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource.service';
import { CubeService } from '../../services/cube.service';

@Component({
  selector: 'app-protein-domain-info',
  templateUrl: './protein-domain-info.component.html',
  styleUrls: ['./protein-domain-info.component.scss']
})
export class ProteinDomainInfoComponent implements OnInit {

  selectedPoint;
  activeResource;

  constructor(
    private resourceService: ResourceService, 
    private cubeService: CubeService
  ) {}

  ngOnInit() {
    this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
      },
    );

    this.cubeService.getSelectedPoint().subscribe(
      point => {
        this.selectedPoint = point;
      }

    );
  }

  openNewTab($event,selectedPoint){
    var acc = selectedPoint.acc
    var api_url = this.activeResource.api_url;
    if (this.activeResource.type == "clanpfam"){
      // https://pfam.xfam.org/clan/;https://pfam.xfam.org/family/
      var res = api_url.split(";");
      if (acc.indexOf('CL') !== -1) {
        api_url = res[0];
      } else {
        api_url = res[1];
      }
    } 
    window.open(api_url + acc);
    
    
  }

}
