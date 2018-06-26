import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource.service';
import { CubeService } from '../../services/cube.service';

@Component({
  selector: 'app-protein-domain-info',
  templateUrl: './protein-domain-info.component.html',
  styleUrls: ['./protein-domain-info.component.scss']
})
export class ProteinDomainInfoComponent implements OnInit {

  selectedPoint=false;

  constructor(
    private resourceService: ResourceService, 
    private cubeService: CubeService
  ) {}

  ngOnInit() {
    this.cubeService.getSelectedPoint().subscribe(
      point => {
        this.selectedPoint = point;
      }

    );
  }

}
