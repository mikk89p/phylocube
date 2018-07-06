import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from './loading.service';
// import * as xml2js from 'xml2js';





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
  // private url: String = 'http://bioinfo.ut.ee:3000/v1/';
  private activeResourceType;
  private previousResourceType;


  // BehaviorSubject
  public activeResourceSubject;
  public activeDatasetSubject;
  public searchResultSubject;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {
    this.activeDatasetSubject =  new BehaviorSubject([]);
    this.activeResourceSubject =  new BehaviorSubject<Object>({});
    this.searchResultSubject =  new BehaviorSubject<string[]>(undefined);
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
        // tslint:disable-next-line:max-line-length
        resource = this.addCubeMaxValuesToResource(resource, resource.eukaryota_genomes, resource.archaea_genomes, resource.bacteria_genomes, resource.virus_genomes);
        resource = this.addAxesTitlesToResource(resource, 'Eukaryota', 'Archaea', 'Bacteria', 'Virus');
        this.loadingService.removeLoading('resource_setActiveResource');
        this.activeResourceSubject.next(resource);
      },

      err => {
        this.loadingService.removeLoading('resource_setActiveResource');
        this.loadingService.setLoading('resource_setActiveResource', 'Error - unable to connect resource database');
      }
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

      err => {
        this.loadingService.removeLoading('resource_getData');
        this.loadingService.setLoading('resource_setActiveResource', 'Error - unable to get data');
      }

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
    const uri = this.url + 'proteindomain/' + acc + '/distribution/' ;
    return this.http.get(uri).map(res => {
        return res[0];
      });
  }

  getClanByPfamAcc(acc: string) {
    // console.log ('getDataByAcc(' + acc + ')');
    const uri = this.url + 'clanmembership/' + acc;
    return this.http.get(uri).map(res => {
        return res[0];
      });
  }

  /* Test - Papillomaviridae | Taxonomy ID: 151340 */
  getAccByTaxonomyId(type: string, taxid: number) {
    const uri = this.url + 'assignment/proteindomain/acc/resource/' + type + '/taxonomy/' + taxid;
    return this.http.get(uri).map(res => {
      const arr = [];
      Object.keys(res).forEach(function(key) {
        const row = res[key];
        arr.push(row.acc);
      });
      return arr;
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

  getAccByUniprotId(uniprotId: string) {
    const uri = 'https://www.uniprot.org/uniprot/' + uniprotId + '.xml';
    const headers = new Headers();
    headers.append('Accept', 'application/xml');
    const requestOptions = Object.assign(
      { responseType: 'text',
        headers: headers }
    );

    return this.http.get(uri, requestOptions).map(res => {
      const xmlDOM = new DOMParser().parseFromString(String(res), 'text/xml');
      return this.xmlToJson(xmlDOM);
    });
  }

  getSearchResult() {
    return this.searchResultSubject;
  }

  setSearchResult(data: string[]) {
    this.searchResultSubject.next(data);
  }


  xmlToJson(xml) {

    // Create the return object
    let obj = {};
    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
      obj['@attributes'] = {};
        for (let j = 0; j < xml.attributes.length; j++) {
          const attribute = xml.attributes.item(j);
          obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
        }
      }
    // tslint:disable-next-line:triple-equals
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
      obj = xml.childNodes[0].nodeValue;
    } else if (xml.hasChildNodes()) {
      for( let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == 'undefined') {
          obj[nodeName] = this.xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == 'undefined') {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this.xmlToJson(item));
        }
      }
    }
    return obj;
  }

}
