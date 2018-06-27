
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Config , Data, Layout} from 'plotly.js';
import * as _ from 'lodash';
import { ResourceService } from '../../services/resource.service';
import { CubeService } from '../../services/cube.service';
import { CubeLimits } from '../../components/cube/cube-limits';
@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements OnInit {
  @ViewChild('chart') el: ElementRef;
  activeDataSet;
  filteredDataSet;
  activeResource;
  cubeLimits;
  

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
      data => {
        // TODO is called 4 times at first load
        this.activeDataSet = data;
        var data = this.applyCubeLimits(this.cubeLimits);
        this.cubeService.setPointsOnCube(data);
      }
    );

    this.cubeService.getPointsOnCube().subscribe(
      data => {
        this.drawChart(data,this.cubeService);
      }
    );

    this.cubeService.getHighlightedPoints().subscribe(
      data => {
        this.highlightPoints(data);
      }
    );

    this.cubeService.getSelectedPoint().subscribe(
      point => {
        var arr = []
        arr.push(point);
        this.highlightPoints(arr);
      }

    );


    this.cubeService.getCubeLimits().subscribe(
      cubeLimits => {
        this.cubeLimits = cubeLimits;
        var data = this.applyCubeLimits(this.cubeLimits);
        this.cubeService.setPointsOnCube(data);
      }
    );
  }

  highlightPoints(points){
    const element = this.el.nativeElement;
    //const layout = this.getLayout(this.activeResource);
    var dataset = points;
    console.log("data" + dataset);
    var highlight = {
      x: this.unpack(dataset,'x'), 
      y: this.unpack(dataset,'y'),
      z: this.unpack(dataset,'z'),
      name: 'highlight',
      mode: 'markers',
      marker: {
        size: 15,
        name:'highlight',
        color: 'rgba(0, 180, 0,0.6)',
        line: {
          color: 'rgba(0, 180, 0,0.1)',
          width: 0.5
        },
        opacity: 0.7},
        type: 'scatter3d'
    }
    if (points.length >= 1){
      Plotly.plot(element, [highlight]);
    }
  
  }

  getXYZ(proteinDomainData) {
    let x = [];
    let y = [];
    let z = [];
    let acc = []
 
    proteinDomainData.forEach(function (row) {
      x.push(row.x);
      y.push(row.y);
      z.push(row.z);
      acc.push(row.acc);
    });
    //x = x.map(x => x * -1);
    return {x: x, y: y, z: z, acc: acc}

  }

  getLayout(resource) {
    /*
      eukaryota_genomes = x
      archaea_genomes = y
      bacteria_genomes = z
      virus_genomes = v
    */
    let layout = {
      title: resource.name?resource.name + ' ' + resource.version:'Loading...',
      autosize: false,
      width: 800,
      height: 700,
      margin: {l: 90, r: 0, b: 0, t: 30},
      scene: {
        xaxis: {
          //autorange: 'reversed',
          title: 'Eukaryota',
          range:[0,resource.xMax],
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
        yaxis: {
          title: 'Archaea',
          range:[0,resource.yMax],
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
        zaxis: {
          title: 'Bacteria',
          range:[0,resource.zMax],
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

  unpack(rows, key) {
    return rows.map(function(row)
    { return row[key]; });
  }

  unpackString(rows, key) {
    return rows.map(function(row)
    { return String(row[key]); });
  }

  drawChart(dataset,cubeService) {
    //const coordinates = this.getXYZ(dataset);
    const layout = this.getLayout(this.activeResource);
    const trace1 = {
      x: this.unpack(dataset,'x'), 
      y: this.unpack(dataset,'y'),
      z: this.unpack(dataset,'z'),
      name: this.unpack(dataset,'acc'),
      mode: 'markers',
      marker: {
        size: 3,
        /* fill color */
        name:this.unpack(dataset,'acc'),
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
    const element = this.el.nativeElement;
    //Plotly.purge(element);
    if (element.data){
      console.log(element.data);
      console.log(element.data.length);
    }
    /* TODO
    if (element.data && element.data.length > 2){
      Plotly.deleteTraces(element, 0);
      Plotly.plot(element, data, layout, [0]);
    } else {
      console.log("as");
      Plotly.newPlot(element, data, layout, [0]);
    }
    */
    Plotly.newPlot(element, data, layout, [0]);

    
    

    element.on('plotly_click', function(points){
      cubeService.setSelectedPoint(points)
    });
  }

  applyCubeLimits(cubeLimits: CubeLimits){
    console.log('applyCubeLimits()');
    //Make deep copy and remove points from the copyed dataset
    var dataset = JSON.parse(JSON.stringify(this.activeDataSet));

    // Array of indexes
    var indexes = [];

    const xMax = this.activeResource.xMax
    const yMax = this.activeResource.yMax
    const zMax = this.activeResource.zMax
    const vMax = this.activeResource.vMax
    //console.log(cubeLimits);
    //console.log(typeof(dataset));
    dataset.forEach(element => {
      let x = (element['x'] / xMax) * 100;
      let y = (element['y']  / yMax) * 100;
      let z = (element['z']  / zMax) * 100;
      //console.log(z);
      if (vMax != undefined) {
        let v = (element['v']  / vMax) * 100;
      }

      /*
      if (x >= cubeLimits.xLowerLimit && x <= cubeLimits.xUpperLimit &&
          y >= cubeLimits.yLowerLimit && y <= cubeLimits.yUpperLimit &&
          z >= cubeLimits.zLowerLimit && z <= cubeLimits.zUpperLimit) {
      */

      if (x < cubeLimits.xLowerLimit || x > cubeLimits.xUpperLimit ||
          y < cubeLimits.yLowerLimit || y > cubeLimits.yUpperLimit ||
          z < cubeLimits.zLowerLimit || z > cubeLimits.zUpperLimit) {
        var index = dataset.indexOf(element);
        indexes.push(index);
      }
      
    });

    //Go through in reverse order without messing up the indexes of the yet-to-be-removed items
    indexes.reverse();
    indexes.forEach(index => {
      if (index !== -1) dataset.splice(index, 1);
    });
    
    this.filteredDataSet = dataset;
    return dataset;
    
  }



}
