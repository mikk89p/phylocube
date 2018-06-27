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
  private highlightedPointsSubject;
  private cubeLimitsSubject;
  private pointsOnCubeSubject;


  constructor(private http: HttpClient, private resourceService: ResourceService) {
    this.pointsOnCubeSubject =  new BehaviorSubject<Object>([]);
    this.highlightedPointsSubject =  new BehaviorSubject<Array<Object>>([]);
    this.selectedPointSubject =  new BehaviorSubject<Array<Object>>([]);
    this.cubeLimitsSubject =  new BehaviorSubject<Object>(new CubeLimits(0,100,0,100,0,100));
   }

  getPointsOnCube(){
    return this.pointsOnCubeSubject;
  }

  setPointsOnCube(data){
    this.pointsOnCubeSubject.next(data);
  }

  getHighlightedPoints(){
    return this.highlightedPointsSubject;
  }

  setHighlightedPoints(data: Array<Object>){
    this.highlightedPointsSubject.next(data);
  }


  setSelectedPoint(points) {
    var point = points['points'][0];
    var acc = point.data.name[point.pointNumber];
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
