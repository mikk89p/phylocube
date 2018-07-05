import { Component, OnInit, OnDestroy } from '@angular/core';
import { CubeService } from '../../services/cube.service';
import { ResourceService } from '../../services/resource.service';
import { CubeLimits } from '../../components/cube/cube-limits';

@Component({
  selector: 'app-cube-manipulation',
  templateUrl: './cube-manipulation.component.html',
  styleUrls: ['./cube-manipulation.component.scss']
})
export class CubeManipulationComponent implements OnInit, OnDestroy {

  activeResource;
  activeDataSet;
  pointsOnCube;
  cubeLimits: CubeLimits;

  xRange = [0, 100];
  yRange = [0, 100];
  zRange = [0, 100];
  sliderConfig = {
    connect: true,
    start: [0, 100],
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

  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  resourceSubscription;
  dataSubscription;
  pointsOnCubeSubscription;
  cubeLimitsSubscription;


  constructor(
    private resourceService: ResourceService,
    private cubeService: CubeService
  ) {}


  ngOnDestroy() {
    this.resourceSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
    this.pointsOnCubeSubscription.unsubscribe();
    this.cubeLimitsSubscription.unsubscribe();
  }

  ngOnInit() {
    this.resourceSubscription = this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
      }
    );

    this.dataSubscription = this.resourceService.getData().subscribe(
      data => {
        this.activeDataSet = data;
      }
    );

    this.pointsOnCubeSubscription = this.cubeService.getPointsOnCube().subscribe(
      data => {
        this.pointsOnCube = data;
      }
    );

    // If user comes back from about page, sliders must be updated
    this.cubeLimitsSubscription = this.cubeService.getCubeLimits().subscribe(
      cubeLimits => {
        if (Object.keys(cubeLimits).length !== 0) {
          this.cubeLimits = cubeLimits;
          this.updateRange(cubeLimits);
        }
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

  seToDefault() {
    this.cubeService.setCubeLimits(new CubeLimits(0, 100, 0, 100, 0, 100));
    this.xRange = [0, 100];
    this.yRange = [0, 100];
    this.zRange = [0, 100];
  }

  updateRange(cubeLimits) {
      this.xRange[0] = cubeLimits.xLowerLimit;
      this.xRange[1] = cubeLimits.xUpperLimit;
      this.yRange[0] = cubeLimits.yLowerLimit;
      this.yRange[1] = cubeLimits.yUpperLimit;
      this.zRange[0] = cubeLimits.zLowerLimit;
      this.zRange[1] = cubeLimits.zUpperLimit;
  }

}
