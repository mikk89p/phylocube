import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private url: String = 'http://localhost:3000/v1/';


  private activeResourceType;


  // BehaviorSubject
  public activeResourceSubject;
  public activeDatasetSubject;

  constructor(private http: HttpClient) {
    this.activeDatasetSubject =  new BehaviorSubject([]);
    this.activeResourceSubject =  new BehaviorSubject<Object>({});
  }


  getActiveResource() {
    console.log ('getActiveResource()');
    return this.activeResourceSubject;
  }

  setActiveResource(type: string) {
    console.log ('setActiveResource(' + type + ')');
    this.activeResourceType = type;
    this.getResourceByType(this.activeResourceType).subscribe(
      resource => {
        // Send new resource to observers
        this.activeResourceSubject.next(resource);
      },
    );
  }

  // Get data based on active resource
  getData() {
    console.log ('getData()');
    // Get current active resource
    this.getActiveResource().subscribe(
      resource => {

        this.getDataByResourceType(resource.type).subscribe(
          dataset => {
            // Send current dataset to observers
            this.activeDatasetSubject.next(dataset);
          },
        );
      },

    );

    return this.activeDatasetSubject;
  }

  // Get all available resources
  getResources() {
    console.log ('getResources()');
    const uri = this.url + 'resource';
    return this.http.get(uri).map(res => {
      return res;
    });
  }

  getResourceByType(type: string) {
    console.log ('getResourceByType()');
    const uri = this.url + 'resource/' + type;
    return this.http.get(uri).map(res => {
      return res[0];
    });
  }

  
  getDataByResourceType(type: string) {
    console.log ('getDataByResourceType()');
    const uri = this.url + 'proteindomain/distribution/resource/' + type;
    return this.http.get(uri).map(res => {
      return res;
    });
  }

  getDataByAcc(acc: string) {
    console.log ('getDataByAcc(' + acc + ')');
    const uri = this.url + 'proteindomain/' + acc;
    return this.http.get(uri).map(res => {
      return res[0];
    });
  }
}
