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
  private previousResourceType;


  // BehaviorSubject
  public activeResourceSubject;
  public activeDatasetSubject;

  constructor(private http: HttpClient) {
    this.activeDatasetSubject =  new BehaviorSubject([]);
    this.activeResourceSubject =  new BehaviorSubject<Object>({});
  }


  getActiveResource() {
    //console.log ('getActiveResource()');
    return this.activeResourceSubject;
  }

  setActiveResource(type: string) {
    //console.log ('setActiveResource(' + type + ')');
    this.activeResourceType = type;
    this.getResourceByType(this.activeResourceType).subscribe(
      resource => {
        // Send new resource to observers
        /*
        eukaryota_genomes = x
        archaea_genomes = y
        bacteria_genomes = z
        virus_genomes = v
        */
        resource = this.addCubeMaxValuesToResource(resource,resource.eukaryota_genomes,resource.archaea_genomes,resource.bacteria_genomes,resource.virus_genomes)
        resource = this.addAxesTitlesToResource(resource,'Eukaryota','Archaea','Bacteria','Virus');
        this.activeResourceSubject.next(resource);
      },
    );
  }

  addCubeMaxValuesToResource(resource,xMax,yMax,zMax,vMax?){
    resource['xMax'] = xMax;
    resource['yMax'] = yMax;
    resource['zMax'] = zMax;
    if (vMax != undefined) {
      resource['vMax'] = vMax;
    }
    
    return resource;
  }

  addAxesTitlesToResource(resource,xTitle,yTitle,zTitle,vTitle?){
    resource['xTitle'] = xTitle;
    resource['yTitle'] = yTitle;
    resource['zTitle'] = zTitle;
    if (vTitle != undefined) {
      resource['vTitle'] = vTitle;
    }
    
    return resource;
  }
  addCubeAxesToResource(){

  }

  // Get data based on active resource
  getData() {
    //console.log ('getData()');
    // Get current active resource
    this.getActiveResource().subscribe(
      resource => {
        if (resource.type == undefined || resource.type == this.previousResourceType){return;}
        this.previousResourceType = resource.type; //set current type to previous
        this.getDataByResourceType(resource.type).subscribe(
          response => {
            let dataset = [];
            Object.keys(response).forEach(function(key) {
              let element = response[key];
              let obj = {
                x: element.eukaryota,
                y: element.archaea,
                z: element.bacteria, 
                v: element.virus,
                acc: element.acc}
              dataset.push(obj);
            });
            this.activeDatasetSubject.next(dataset);
          },
        );
      },

    );

    return this.activeDatasetSubject;
  }

  // Get all available resources
  getResources() {
    //console.log ('getResources()');
    const uri = this.url + 'resource';
    return this.http.get(uri).map(res => {
      return res;
    });
  }

  getResourceByType(type: string) {
    //console.log ('getResourceByType()');
    const uri = this.url + 'resource/' + type;
    return this.http.get(uri).map(res => {
      return res[0];
    });
  }

  
  getDataByResourceType(type: string) {
    //console.log ('getDataByResourceType()');
    const uri = this.url + 'proteindomain/distribution/resource/' + type;
    return this.http.get(uri).map(res => {
      return res;
    });

  }

  getDataByAcc(acc: string) {
    //console.log ('getDataByAcc(' + acc + ')');
    const uri = this.url + 'proteindomain/' + acc;
    return this.http.get(uri).map(res => {
        return res[0];
      });
  }
}
