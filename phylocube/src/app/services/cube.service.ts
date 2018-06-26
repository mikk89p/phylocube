import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs';
import { ResourceService } from './resource.service';

@Injectable({
  providedIn: 'root'
})
export class CubeService {

  selectedPointSubject;

  constructor(private http: HttpClient, private resourceService: ResourceService) {
    this.selectedPointSubject =  new BehaviorSubject<Object>([]);
   }


  setSelectedPoint(data) {
    var point = data['points'][0];
    var acc = point.data.name[point.pointNumber];
    this.resourceService.getDataByAcc(acc).subscribe(
      proteinDomain => {
        proteinDomain['x'] = point.x;
        proteinDomain['y'] = point.y;
        proteinDomain['z'] = point.z;
        //console.log ('setSelectedPoint(' + proteinDomain + ')');
        this.selectedPointSubject.next(proteinDomain);
      }

    )
    
  }

  getSelectedPoint(){
    return this.selectedPointSubject;
  }

}
