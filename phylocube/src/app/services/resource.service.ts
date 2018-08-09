import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject, forkJoin, ReplaySubject } from 'rxjs';
import { LoadingService } from './loading.service';






export interface Point {
  x: number;
  y: number;
  z: number;
  v: number;
  acc: string;
  description: string;
  classification: string;
  highlighted: boolean;
  size?: number;
}


@Injectable({
  providedIn: 'root'
})


export class ResourceService {

  private url: String = 'http://localhost:3000/api/v1/';
  // private url: String = 'http://bioinfo.ut.ee:3000/api/v1/';
  private activeResource;
  private previousResource;


  // Subject
  public activeResourceSubject;
  public activeDatasetSubject;
  public searchResultSubject;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {
    this.activeDatasetSubject =  new ReplaySubject(1); // new BehaviorSubject<Object[]>([]);
    this.activeResourceSubject =  new BehaviorSubject<Object>({xTitle: '', yTitle: '', zTitle: '' , vTitle: ''});
    this.searchResultSubject =  new ReplaySubject(1); // new BehaviorSubject<string[]>(undefined);
  }


  getActiveResource() {
    // console.log ('getActiveResource()');
    return this.activeResourceSubject;
  }

  setActiveResource(type: string) {
    // tslint:disable-next-line:triple-equals
    if (type == undefined || type == '' || (this.activeResource && this.activeResource.type == type)) {return; }
    this.loadingService.setLoading('resource_setActiveResource', 'Getting resource');
    this.getResourceByType(type).subscribe(
      resource => {
        // tslint:disable-next-line:max-line-length
        resource = this.addCubeMaxValuesToResource(resource, resource.eukaryota_genomes, resource.archaea_genomes, resource.bacteria_genomes, resource.virus_genomes);
        resource = this.addAxesTitlesToResource(resource, 'Eukaryota', 'Archaea', 'Bacteria', 'Virus');
        this.loadingService.removeLoading('resource_setActiveResource');
        this.activeResource = resource;
        this.activeResourceSubject.next(this.activeResource);
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

  getDataWithCountsByTaxonomyId (taxid: number) {
    // console.log(taxid);
    const uri = this.url + 'assignment/proteindomain/resource/' + this.activeResourceSubject.value.type + '/taxonomy/' + taxid;
    const start = new Date().getTime();
    return this.http.get(uri).map(res => {
      const end = new Date().getTime();
      this.loadingService.openSnackBar('Taxonomy ID: ' + taxid + ' data acquired (' + ((end - start) / 1000) + 's)', 15000);
      return res;
    });
  }

  setAxesByTaxonomyId(taxIdX: number, nameX: string, taxIdY: number, nameY: string, taxIdZ: number, nameZ: string) {
    this.loadingService.setLoading('resource_setAxesByTaxonomyId', 'Getting data');
    const taxonX = this.getDataWithCountsByTaxonomyId(taxIdX);
    const taxonY = this.getDataWithCountsByTaxonomyId(taxIdY);
    const taxonZ = this.getDataWithCountsByTaxonomyId(taxIdZ);
    const taxonV = this.getDataWithCountsByTaxonomyId(10239);

    const dataset: Point[] = [];

    forkJoin([taxonX, taxonY, taxonZ, taxonV]).subscribe(results => {
      let xMax = 0;
      let yMax = 0;
      let zMax = 0;
      let vMax = 0;
      let point: Point;
      Object.keys(results[0]).forEach(function(key) {
        const el = results[0][key];
        const count = Number(el.count);
        xMax = (count > xMax) ? count : xMax;

        point = {
          x: count,
          y: 0,
          z: 0,
          v: 0,
          acc: el.acc,
          description: el.description,
          classification: el.classification,
          highlighted: false,

        };
        dataset.push(point);
      });

      Object.keys(results[1]).forEach(function(key) {
        const el = results[1][key];
        const count = Number(el.count);
        yMax = (count > yMax) ? count : yMax;

        const found = dataset.find(function(element) {
          if (element.acc === el.acc) {
            element.y = count;
          }
          return element.acc === el.acc;
        });

        if (!found) {
          point = {
            x: 0,
            y: count,
            z: 0,
            v: 0,
            acc: el.acc,
            description: el.description,
            classification: el.classification,
            highlighted: false,
          };
          dataset.push(point);
        }
      });

      Object.keys(results[2]).forEach(function(key) {
        const el = results[2][key];
        const count = Number(el.count);
        zMax = (count > zMax) ? count : zMax;

        const found = dataset.find(function(element) {
          if (element.acc === el.acc) {
            element.z = el.count;
          }
          return element.acc === el.acc;
        });

        if (!found) {
          point = {
            x: 0,
            y: 0,
            z: count,
            v: 0,
            acc: el.acc,
            description: el.description,
            classification: el.classification,
            highlighted: false,
          };
          dataset.push(point);
        }
      });

      Object.keys(results[3]).forEach(function(key) {
        const el = results[3][key];
        const count = Number(el.count);
        vMax = (count > vMax) ? count : vMax;

        dataset.find(function(element) {
          if (element.acc === el.acc) {
            element.v = el.count;
          }
          return element.acc === el.acc;
        });
      });


      // Bacteria | Taxonomy ID: 2
      this.activeResource = this.addCubeMaxValuesToResource(this.activeResourceSubject.value, xMax, yMax, zMax, vMax);
      this.activeResource = this.addAxesTitlesToResource(this.activeResource, nameX, nameY, nameZ);
      this.activeDatasetSubject.next(dataset);
      this.loadingService.removeLoading('resource_setAxesByTaxonomyId');
    });

  }

  // Get data based on active resource
  getData() {
    this.getActiveResource().subscribe(
      resource => {
        // TODO use .pipe(mergeMap...
        // tslint:disable-next-line:triple-equals
        if (resource.type == undefined || JSON.stringify(resource) == JSON.stringify(this.previousResource)) { return; }
        this.loadingService.setLoading('resource_getData', 'Getting data');
        this.previousResource = resource;
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
                classification: element.classification,
                highlighted: false,
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
    return this.http.get(uri);
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
    return this.http.get(uri);

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
          classification: point.classification,
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

    // TODO borrowed funct
    // Create the return object
    let obj = {};
    if (xml.nodeType === 1) { // element
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
      for ( let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        if (typeof(obj[nodeName]) === 'undefined') {
          obj[nodeName] = this.xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) === 'undefined') {
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
