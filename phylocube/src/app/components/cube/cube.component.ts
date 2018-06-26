
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Config , Data, Layout} from 'plotly.js';
import * as _ from 'lodash';
import { ResourceService } from '../../services/resource.service';
import { CubeService } from '../../services/cube.service';
@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements OnInit {
  @ViewChild('chart') el: ElementRef;
  activeDataSet;
  activeResource;
  

  constructor(
    private resourceService: ResourceService, 
    private cubeService: CubeService
  ) {}

  ngOnInit() {
    this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
      }
    );

    this.resourceService.getData().subscribe(
      proteinDomainData => {
        // TODO is called 4 times at first load
        this.activeDataSet = proteinDomainData;
        this.drawChart(this.el.nativeElement, this.activeDataSet, this.activeResource, this.cubeService);
      }
    );
  }

  getXYZ(proteinDomainData) {
    let x = [];
    let y = [];
    let z = [];
    let acc = []
 
    proteinDomainData.forEach(function (row) {
      x.push(row.eukaryota);
      y.push(row.archaea);
      z.push(row.bacteria);
      acc.push(row.acc);
    });
    //x = x.map(x => x * -1);
    return {x: x, y: y, z: z, acc: acc}

  }

  getLayout(resource) {
    let layout = {
      title: resource.name + ' ' + resource.version,
      autosize: false,
      width: 800,
      height: 700,
      margin: {l: 90, r: 0, b: 0, t: 0},
      scene: {
        xaxis: {
          autorange: 'reversed',
          title: 'Eukaryota',
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
        yaxis: {
          title: 'Archaea',
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
        zaxis: {
          title: 'Bacteria',
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      }
    };
    return layout; // {margin: {l: 0, r: 100, b: 0, t: 0}};
  }

  drawChart(element, activeData, resource, service) {
    const coordinates = this.getXYZ(activeData);
    const layout = this.getLayout(resource);
    const trace1 = {
      x: coordinates['x'], 
      y: coordinates['y'], 
      z: coordinates['z'],
      name: coordinates['acc'],
      mode: 'markers',
      marker: {
        size: 3,
        /* fill color */
        name:coordinates['acc'],
        color: 'rgba(0, 0, 0,0.6)',
        line: {
          /* outer line color */
          color: 'rgba(0, 0, 0,0.1)',
          width: 0.5
        },
        opacity: 0.8},
      type: 'scatter3d'
    };
    const data = [trace1];

    Plotly.purge(element);
    Plotly.plot(element, data, layout);

    element.on('plotly_click', function(data){
      service.setSelectedPoint(data);
    });
  }

}
