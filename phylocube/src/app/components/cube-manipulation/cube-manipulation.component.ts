import { Component, OnInit, OnDestroy } from '@angular/core';
import { CubeService } from '../../services/cube.service';
import { ResourceService } from '../../services/resource.service';
import { CubeParameters } from '../../components/cube/cube-parameters';

@Component({
  selector: 'app-cube-manipulation',
  templateUrl: './cube-manipulation.component.html',
  styleUrls: ['./cube-manipulation.component.scss']
})
export class CubeManipulationComponent implements OnInit, OnDestroy {

  activeResource;
  activeDataSet = [];
  pointsOnCube = [];
  cubeParameters: CubeParameters;

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
  cubeParametersSubscription;


  constructor(
    private resourceService: ResourceService,
    private cubeService: CubeService
  ) {}


  ngOnDestroy() {
    this.resourceSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
    this.pointsOnCubeSubscription.unsubscribe();
    // this.cubeParametersSubscription.unsubscribe();
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


    this.cubeParameters = this.cubeService.getCubeParameters().value;
    this.updateRange(this.cubeParameters);

  }

  updateCube() {
    this.cubeService.setBoundaries(
      this.xRange[0],
      this.xRange[1],
      this.yRange[0],
      this.yRange[1],
      this.zRange[0],
      this.zRange[1]);
  }

  seToDefault() {
    this.cubeService.setBoundaries(0, 100, 0, 100, 0, 100);
    this.xRange = [0, 100];
    this.yRange = [0, 100];
    this.zRange = [0, 100];
  }

  updateRange(cubeParameters) {
      this.xRange[0] = cubeParameters.xLowerLimit;
      this.xRange[1] = cubeParameters.xUpperLimit;
      this.yRange[0] = cubeParameters.yLowerLimit;
      this.yRange[1] = cubeParameters.yUpperLimit;
      this.zRange[0] = cubeParameters.zLowerLimit;
      this.zRange[1] = cubeParameters.zUpperLimit;
  }

  clearHighlight() {
    this.cubeService.setHighlightedPoints(false);
  }

}
