import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs';
import { ResourceService } from './resource.service';
import { Point } from './resource.service';
import { CubeLimits } from '../components/cube/cube-limits';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class CubeService {

  private selectedPointSubject;
  private highlightedPointSubject;
  private cubeLimitsSubject;
  private fullDataSubject;
  private pointsOnCubeSubject;
  private previousData = [];


  constructor(
    private http: HttpClient,
    private resourceService: ResourceService,
    private loadingService: LoadingService
  ){
    this.pointsOnCubeSubject =  new BehaviorSubject([]);
    this.highlightedPointSubject =  new BehaviorSubject<Object>({'data': [], 'description' : 'NULL'});
    this.selectedPointSubject =  new BehaviorSubject<Object>({});
    this.cubeLimitsSubject =  new BehaviorSubject<Object>(new CubeLimits(0, 100, 0, 100, 0, 100));
   }

   getFullData() {
    // tslint:disable-next-line:triple-equals
    if (this.fullDataSubject == undefined) {
      this.fullDataSubject =  new BehaviorSubject([]);
      this.resourceService.getData().subscribe(
        data => {
          this.fullDataSubject.next(data);
        }
      );
    }
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
      // tslint:disable-next-line:triple-equals
      if (this.previousData.length == 0 || (this.previousData && this.previousData.join('') != data.join(''))){
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
  }

  getHighlightedPoints() {
    return this.highlightedPointSubject;
  }

  setHighlightedPoints(points, description?) {
    description = description ?  description : 'Null';
    this.highlightedPointSubject.next({'data': points, 'description' : description});
  }


  highlightPointsByTaxonomyId(type: string, taxid: number, description: string) {
    // Papillomaviridae | Taxonomy ID: 151340
    // Mimiviridae | Taxonomy ID: 549779
    this.loadingService.setLoading('resource_highlightPointsByTaxonomyId',
    'Getting ' + description + ' data' );
    this.resourceService.getDataByTaxonomyId(type, taxid).subscribe(
      points => {
        this.loadingService.removeLoading('resource_highlightPointsByTaxonomyId');
        this.setHighlightedPoints(points, description);
      },
      err => {
        // TODO, handle error
        console.log(err);
        this.loadingService.removeLoading('resource_highlightPointsByTaxonomyId');
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
        // TODO, handle error
        console.log(err);
        this.loadingService.removeLoading('resource_setPointsByTaxonomyId');
      }

    );

  }


  setSelectedPoint(points) {
    // tslint:disable-next-line:triple-equals
    if (points['points'][0] != undefined && points['points'][0].data.is_highlight == undefined) {
      const pointData = points['points'][0];
      const point: Point = {
        x: pointData.x,
        y: pointData.y,
        z: pointData.y,
        v: pointData.v,
        acc: pointData.data.acc[pointData.pointNumber],
        description: pointData.description,
        highlighted: pointData.data.highlighted[pointData.pointNumber],
      };

      this.selectedPointSubject.next(point);

    }

  }

  getSelectedPoint() {
    return this.selectedPointSubject;
  }

  setCubeLimits(cubeLimits) {
    this.cubeLimitsSubject.next(cubeLimits);
  }

  getCubeLimits() {
    return this.cubeLimitsSubject;
  }

}
