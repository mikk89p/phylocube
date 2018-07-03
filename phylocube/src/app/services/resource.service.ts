import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from './loading.service';

export interface Point {
  x: number;
  y: number;
  z: number;
  v: number;
  acc: string;
  description: string;
  highlighted: boolean;
}


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

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {
    this.activeDatasetSubject =  new BehaviorSubject([]);
    this.activeResourceSubject =  new BehaviorSubject<Object>({});
  }


  getActiveResource() {
    // console.log ('getActiveResource()');
    return this.activeResourceSubject;
  }

  setActiveResource(type: string) {
    // console.log ('setActiveResource(' + type + ')');
    this.activeResourceType = type;
    this.loadingService.setLoading('resource_setActiveResource', 'Getting resource');
    this.getResourceByType(this.activeResourceType).subscribe(
      resource => {
        // Send new resource to observers
        /*
        eukaryota_genomes = x
        archaea_genomes = y
        bacteria_genomes = z
        virus_genomes = v
        */
        // tslint:disable-next-line:max-line-length
        resource = this.addCubeMaxValuesToResource(resource, resource.eukaryota_genomes, resource.archaea_genomes, resource.bacteria_genomes, resource.virus_genomes);
        resource = this.addAxesTitlesToResource(resource, 'Eukaryota', 'Archaea', 'Bacteria', 'Virus');
        this.loadingService.removeLoading('resource_setActiveResource');
        this.activeResourceSubject.next(resource);
      },
    );
  }

  addCubeMaxValuesToResource(resource, xMax, yMax, zMax, vMax?) {
    resource['xMax'] = xMax;
    resource['yMax'] = yMax;
    resource['zMax'] = zMax;
    // tslint:disable-next-line:triple-equals
    if (vMax != undefined) {
      resource['vMax'] = vMax;
    }

    return resource;
  }

  addAxesTitlesToResource(resource, xTitle, yTitle, zTitle, vTitle?) {
    resource['xTitle'] = xTitle;
    resource['yTitle'] = yTitle;
    resource['zTitle'] = zTitle;
    // tslint:disable-next-line:triple-equals
    if (vTitle != undefined) {
      resource['vTitle'] = vTitle;
    }
    return resource;
  }

  addCubeAxesToResource() {

  }

  // Get data based on active resource
  getData() {
    // Console.log ('getData()');
    // Get current active resource
    this.getActiveResource().subscribe(
      resource => {
        // tslint:disable-next-line:triple-equals
        if (resource.type == undefined || resource.type == this.previousResourceType) { return; }
        this.loadingService.setLoading('resource_getData', 'Getting data');
        this.previousResourceType = resource.type; // set current type to previous
        this.getDataByResourceType(resource.type).subscribe(
          response => {
            const dataset: Point[] = [];
            Object.keys(response).forEach(function(key) {
              const element = response[key];
              const obj: Point = {
                x: element.eukaryota,
                y: element.archaea,
                z: element.bacteria,
                v: element.virus,
                acc: element.acc,
                description: element.description,
                highlighted: false
              };
              dataset.push(obj);
            });
            this.loadingService.removeLoading('resource_getData');
            this.activeDatasetSubject.next(dataset);
          },
        );
      },

    );

    return this.activeDatasetSubject;
  }

  // Get all available resources
  getResources() {
    // console.log ('getResources()');
    const uri = this.url + 'resource';
    return this.http.get(uri).map(res => {
      return res;
    });
  }

  getResourceByType(type: string) {
    // console.log ('getResourceByType()');
    const uri = this.url + 'resource/' + type;
    return this.http.get(uri).map(res => {
      return res[0];
    });
  }

  getDataByResourceType(type: string) {
    // console.log ('getDataByResourceType()');
    const uri = this.url + 'proteindomain/distribution/resource/' + type;
    return this.http.get(uri).map(res => {
      return res;
    });

  }

  getDataByAcc(acc: string) {
    // console.log ('getDataByAcc(' + acc + ')');
    const uri = this.url + 'proteindomain/' + acc;
    return this.http.get(uri).map(res => {
        return res[0];
      });
  }

  getDataByTaxonomyId(type: string, taxid: number) {
    // console.log ('getDataByResourceType()');
    const uri = this.url + 'assignment/proteindomain/distribution/resource/' + type + '/taxonomy/' + taxid;
    return this.http.get(uri).map(res => {
      const points = [];
      Object.keys(res).forEach(function(key) {
        const point = res[key];
        const obj: Point = {
          x: point.eukaryota,
          y: point.archaea,
          z: point.bacteria,
          v: point.virus,
          acc: point.acc,
          description: point.description,
          highlighted: false // It will be changed to true
        };
        points.push(obj);

      });
      return points;
    });

  }
}
