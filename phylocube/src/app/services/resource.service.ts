import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private url: String = 'http://localhost:3000/v1/';

  // Current active data, default supfam
  private activeResourceType = 'supfam';


  // BehaviorSubject
  public activeResource;
  public activeDataset;

  constructor(private http: HttpClient) {
    this.activeDataset =  new BehaviorSubject<Object>({});
    this.activeResource =  new BehaviorSubject<Object>({});
  }


  getResources() {
    console.log ('getResources()');
    const uri = this.url + 'resource';
    return this.http.get(uri).map(res => {
      return res;
    });
  }

  setActiveResource(type: string) {
    console.log ('setActiveResource(' + type + ')');
    this.activeResourceType = type;
    this.getResourceByType(this.activeResourceType).subscribe(
      resource => {
        // Send new resource to observers
        this.activeResource.next(resource);
      },
    );
  }

  getActiveResource() {
    console.log ('getActiveResource()');
    // Get  current active resource
    this.getResourceByType(this.activeResourceType).subscribe(
      resource => {
        // Send current active resource to observers
        this.activeResource.next(resource);
      },
    );
    // Return BehaviorSubject
    return this.activeResource;
  }

  getResourceByType(type: string) {
    console.log ('getResourceByType()');
    const uri = this.url + 'resource/' + type;
    return this.http.get(uri).map(res => {
      return res[0];
    });
  }

  getData() {
    console.log ('getData()');
    // Get current active resource
    this.getActiveResource().subscribe(
      resource => {
        this.getDataByResourceType(resource.type).subscribe(
          dataset => {
            // Send current dataset to observers
            this.activeDataset.next(dataset);
          },
        );
      },

    );

    return this.activeDataset;
  }


  getDataByResourceType(type: string) {
    console.log ('getDataByResourceType()');
    const uri = this.url + 'proteindomain/distribution/resource/' + type;
    return this.http.get(uri).map(res => {
      return res;
    });
  }
}
