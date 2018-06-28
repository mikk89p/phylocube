import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs';
import { ResourceService } from './resource.service';
import { CubeLimits } from '../components/cube/cube-limits';

@Injectable({
  providedIn: 'root'
})
export class CubeService {

  private selectedPointSubject;
  private highlightedPointSubject;
  private cubeLimitsSubject;
  private pointsOnCubeSubject;
  private previousData: {}[] = [];


  constructor(private http: HttpClient, private resourceService: ResourceService) {
    this.pointsOnCubeSubject =  new BehaviorSubject([]);
    this.highlightedPointSubject =  new BehaviorSubject<Object>({});
    this.selectedPointSubject =  new BehaviorSubject<Object>({});
    this.cubeLimitsSubject =  new BehaviorSubject<Object>(new CubeLimits(0,100,0,100,0,100));
   }

  getPointsOnCube(){
    return this.pointsOnCubeSubject;
  }

  setPointsOnCube(data: {}[]){
    if (data.length > 0){
      if (this.previousData.length == 0 || (this.previousData && this.previousData.join('') != data.join(''))){
        this.previousData = data;
        this.pointsOnCubeSubject.next(data);
      }
    }
    
  }

  getHighlightedPoint(){
    return this.highlightedPointSubject;
  }

  setHighlightedPoint(data: Object){
    this.highlightedPointSubject.next(data);
  }


  setSelectedPoint(points) {
    var point = points['points'][0];
    var acc = point.data.acc[point.pointNumber];
    this.resourceService.getDataByAcc(acc).subscribe(
      proteinDomain => {
        proteinDomain['x'] = point.x;
        proteinDomain['y'] = point.y;
        proteinDomain['z'] = point.z;
        this.selectedPointSubject.next(proteinDomain);
      }

    )
    
  }

  getSelectedPoint(){
    return this.selectedPointSubject;
  }

  setCubeLimits(cubeLimits){
    this.cubeLimitsSubject.next(cubeLimits);
  }

  getCubeLimits() {
    return this.cubeLimitsSubject;
  }

}
