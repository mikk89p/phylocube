import { CubeParameters } from './../components/cube/cube-parameters';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ResourceService } from './resource.service';
import { Point } from './resource.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class CubeService {



  // variables
  // x, y, z boundaries and color scheme
  cubeParameters = new CubeParameters(0, 100, 0, 100, 0, 100, 0, 0, 100);

  // Subjects
  private selectedPointSubject;
  private highlightedPointSubject;
  private cubeParametersSubject;
  private fullDataSubject;
  private pointsOnCubeSubject;
  private dynamicAxesSubject;
  private plotTypeSubject;


  private previousData = [];

  constructor(
    private http: HttpClient,
    private resourceService: ResourceService,
    private loadingService: LoadingService
  ) {
    // ReplaySubject
    this.pointsOnCubeSubject =  new ReplaySubject(1); // new BehaviorSubject<Object[]>([]);
    this.highlightedPointSubject =  new ReplaySubject(1); // new BehaviorSubject<Object>({'data': [], 'description' : 'NULL'});
    this.selectedPointSubject =  new ReplaySubject(1); // new BehaviorSubject<Object>({});
    this.cubeParametersSubject =  new BehaviorSubject<Object>(this.cubeParameters);
    this.dynamicAxesSubject = new ReplaySubject(1);
    this.fullDataSubject =  new ReplaySubject(1);
    this.plotTypeSubject =  new ReplaySubject(1);

    this.resourceService.getData().subscribe(
      data => {
        this.fullDataSubject.next(data);
      }
    );

   }



  getFullData() {
    return this.fullDataSubject;
  }

  setFullData(data) {
    this.fullDataSubject.next(data);
  }

  getPointsOnCube() {
    return this.pointsOnCubeSubject;
  }

  setPointsOnCube(data) {
    if (data.length > 0) {
       if (this.previousData) {
          // Copy highlighted points to new data
          this.previousData.forEach(oldPoint => {
              // Set highlight from current currentDataset
              if (oldPoint.highlighted) {
                const acc = oldPoint.acc;
                data.forEach(point => {
                  // tslint:disable-next-line:triple-equals
                  if (acc == point.acc) {
                    point.highlighted = true;
                  }
                });
              }
          });
        }
        this.previousData = data;
        this.pointsOnCubeSubject.next(data);
      }
  }

  getHighlightedPoints() {
    return this.highlightedPointSubject;
  }

  setHighlightedPoints(points, description?) {
    description = description ?  description : 'Null';
    this.highlightedPointSubject.next({'data': points, 'description' : description});
  }


  highlightPointsByTaxonomyId(type: string, taxid: number, description: string) {
    this.loadingService.setLoading('resource_highlightPointsByTaxonomyId',
    'Getting ' + description + ' data' );
    this.resourceService.getDataByTaxonomyId(type, taxid).subscribe(
      points => {
        this.loadingService.removeLoading('resource_highlightPointsByTaxonomyId');
        this.setHighlightedPoints(points, description);
      },
      err => {
        this.loadingService.removeLoading('resource_highlightPointsByTaxonomyId');
        this.loadingService.openDialog('Error', err.statusText);
      }

    );
  }

  setPointsByTaxonomyId(type: string, taxid: number, description: string) {
    this.loadingService.setLoading('resource_setPointsByTaxonomyId',
    'Getting ' + description + ' data' );
    this.resourceService.getDataByTaxonomyId(type, taxid).subscribe(
      points => {
        this.loadingService.removeLoading('resource_setPointsByTaxonomyId');
        this.setFullData(points);
      },
      err => {
        this.loadingService.removeLoading('resource_setPointsByTaxonomyId');
        this.loadingService.openDialog('Error', err.statusText);
      }

    );

  }


  setSelectedPoint(points) {
    // tslint:disable-next-line:triple-equals
    if (points['points'][0] != undefined && points['points'][0].data.is_highlight == undefined) {
      const pointData = points['points'][0];
      const point: Point = {
        x: Math.abs(pointData.x),
        y: pointData.y,
        z: pointData.z,
        v: pointData.data.v[pointData.pointNumber],
        acc: pointData.data.acc[pointData.pointNumber],
        description: pointData.data.description[pointData.pointNumber],
        highlighted: pointData.data.highlighted[pointData.pointNumber]
      };

      this.selectedPointSubject.next(point);

    }

  }

  setBoundaries(
    xLowerLimit: number,
    xUpperLimit: number,
    yLowerLimit: number,
    yUpperLimit: number,
    zLowerLimit: number,
    zUpperLimit: number,
    vLowerLimit?: number,
    vUpperLimit?: number) {

      const params = this.cubeParametersSubject.value;
      params.xLowerLimit = xLowerLimit;
      params.xUpperLimit = xUpperLimit;
      params.yLowerLimit = yLowerLimit;
      params.yUpperLimit = yUpperLimit;
      params.zLowerLimit = zLowerLimit;
      params.zUpperLimit = zUpperLimit;
      params.vLowerLimit = vLowerLimit;
      params.vUpperLimit = vUpperLimit;
      this.setCubeParameters(params);
  }

  setCubeParameters(cubeParameters) {
    this.cubeParametersSubject.next(cubeParameters);
  }

  getCubeParameters() {
    return this.cubeParametersSubject;
  }

  setColorScheme(value) {
    const newParams = this.cubeParametersSubject.value;
    newParams.colorScheme = value;
    this.setCubeParameters(newParams);
  }

  getSelectedPoint() {
    return this.selectedPointSubject;
  }

  getDynamicAxes() {
    return this.dynamicAxesSubject;
  }

  setDynamicAxes(value: boolean) {
    this.dynamicAxesSubject.next(value);
  }

  getPlotType() {
    return this.plotTypeSubject;
  }

  setPlotType(type: string) {
    this.plotTypeSubject.next(type);
  }
}
