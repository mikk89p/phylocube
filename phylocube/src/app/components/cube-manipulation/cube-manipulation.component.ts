import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CubeService } from '../../services/cube.service';
import { ResourceService } from '../../services/resource.service';
import { CubeLimits } from '../../components/cube/cube-limits';

@Component({
  selector: 'app-cube-manipulation',
  templateUrl: './cube-manipulation.component.html',
  styleUrls: ['./cube-manipulation.component.scss']
})
export class CubeManipulationComponent implements OnInit {

  private activeResource;
  private cubeLimits: CubeLimits;

  xRange=[0, 100];
  yRange=[0, 100];
  zRange=[0, 100];
  
  sliderConfig = {
    connect: true,
    start: [0,100],
    step: 0.5,
    range: {
      'min': [0],
      'max': [100]
    },
    pips: {
      mode: 'range',
      density: 3,
    },
    tooltips: true,
  };


  constructor(
    private resourceService: ResourceService, 
    private cubeService: CubeService
  ) {}

  ngOnInit() {
    this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
      }
    );
  }

  updateCube() {
    this.cubeLimits = new CubeLimits(
      this.xRange[0],
      this.xRange[1],
      this.yRange[0],
      this.yRange[1],
      this.zRange[0],
      this.zRange[1]);
    this.cubeService.setCubeLimits(this.cubeLimits);
  }

}
