import { map } from 'rxjs/operators';

import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
export class CubeComponent implements OnInit, OnDestroy {
  @ViewChild('chart') el: ElementRef;
  fullDataSet;
  // filtered Dataset
  currentDataSet;
  activeResource;
  previousResource = {};
  cubeLimits;
  plotlyEvents = [];

  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  resourceSubscription;
  fullDataSubscription;
  pointsOnCubeSubscription;
  highlightSubscription;
  selectedPointSubscription;

  constructor(
    private resourceService: ResourceService,
    private cubeService: CubeService
  ) {}

  ngOnDestroy() {
    this.resourceSubscription.unsubscribe();
    this.fullDataSubscription.unsubscribe();
    this.pointsOnCubeSubscription.unsubscribe();
    this.highlightSubscription.unsubscribe();
    this.selectedPointSubscription.unsubscribe();
  }
  
  ngOnInit() {
    this.resourceSubscription = this.resourceService.getActiveResource().subscribe(
      resource => {
        // console.log('Cube component getActiveResource()');
        this.activeResource = resource;
      }
    );

    /* Full data is needed for sliders faster interaction */
    this.fullDataSubscription = this.cubeService.getFullData().subscribe(
      data => {
        this.fullDataSet = data;
        this.cubeService.getCubeLimits().subscribe(
          cubeLimits => {
            if (Object.keys(cubeLimits).length !== 0) {
              const filteredData = this.applyCubeLimits(cubeLimits);
              this.cubeService.setPointsOnCube(filteredData);
            }
          }
        );
      }
    );

    this.pointsOnCubeSubscription = this.cubeService.getPointsOnCube().subscribe(
      data => {
        if (data !== undefined && data.length !== 0) {
          this.drawChart(data, this.cubeService);
        }
      }
    );

    this.highlightSubscription = this.cubeService.getHighlightedPoints().subscribe(
      result => {
        const points = result.data;
        const description = result.description;
        // tslint:disable-next-line:triple-equals
        if (points != undefined) {
          if (points.length > 1) {
            if (points.length < 250) {
              this.currentDataSet.forEach(pointOnCube => {
                for (let i = 0; i < points.length; i++) {
                  // tslint:disable-next-line:triple-equals
                  if (pointOnCube.acc == points[i].acc) {
                    this.highlightPoint(points[i]);
                  }
                }
              });
            } else {
              this.highlightMultiplePoints(points, description);
            }
          } else {
            const point = points[0];
            this.highlightPoint(point);
          }
        }
      }
    );


    this.selectedPointSubscription =  this.cubeService.getSelectedPoint().subscribe(
      point => {
        // tslint:disable-next-line:triple-equals
        if (point != undefined) {
          // TODO
          // this.highlightPoint(point);
        }
      }
    );


  }



  unpack(rows, key) {
    return rows.map(function(row) {
      // tslint:disable-next-line:triple-equals
      if (key == 'x') {
        return -1 * row[key];
      }
      return row[key];
    });
  }


  highlightMultiplePoints(points, description) {
    if (points === undefined || points.length === 0 || JSON.stringify(points) === JSON.stringify({})) {return; }

    const element = this.el.nativeElement;

    // If number of points exceed threshold then the highlight is not set
    /*
    points.forEach(point => {
      if (point.highlighted == undefined || !point.highlighted) {
        point.highlighted = true;
      } else {
        point.highlighted = false;
      }

    });
    */
    const highlight = {
      x: this.unpack(points, 'x'),
      y: this.unpack(points, 'y'),
      z: this.unpack(points, 'z'),
      acc: this.unpack(points, 'acc'),
      // is_highlight: true,
      name: description,
      mode: 'markers',
      marker: {
        size: 15,
        color: 'rgba(0, 180, 0,0.6)',
        line: {
          color: 'rgba(0, 180, 0,0.1)',
          width: 0.5
        },
        opacity: 0.7},
        type: 'scatter3d'
    };

    Plotly.plot(element, [highlight]);
  }

  highlightPoint(point) {
    if (point === undefined || JSON.stringify(point) === JSON.stringify({})) {return; }
    const element = this.el.nativeElement;
    // tslint:disable-next-line:triple-equals
    if (point.highlighted == undefined || !point.highlighted) {
      const highlight = {
        x: this.unpack([point], 'x'),
        y: this.unpack([point], 'y'),
        z: this.unpack([point], 'z'),
        acc: this.unpack([point], 'acc'),
        // is_highlight: true,
        name: point.acc,
        mode: 'markers',
        marker: {
          size: 15,
          color: 'rgba(0, 180, 0,0.6)',
          line: {
            color: 'rgba(0, 180, 0,0.1)',
            width: 0.5
          },
          opacity: 0.7},
          type: 'scatter3d'
      };

      while ( true ) {
        Plotly.plot(element, [highlight]);
        point.highlighted = true; // Toggle highlight
      break;
     }
    } else {
      setTimeout(function() {
        let index = 0;
        const indexes = [];
        element.data.forEach(trace => {
          // tslint:disable-next-line:triple-equals
          if (trace.name == point.acc) {
            indexes.push(index);
          }
          index ++;
        });
        // Remove highlight
        // console.log('Delete index: ' + index);
        // console.log('Delete array length ' + element.data.length);
        Plotly.deleteTraces(element, indexes);
        point.highlighted = false; // Toggle ighlight
      }, 0);
    }
  }


  getLayout(resource) {

    // x-axis is reversed by default and it cannot be changd with autorange: 'reversed',
    // As reversed is not implemented in plotly 3D scatter *-1 is a workaround
    // Therefore, also tickvals should be fixed
    const steps = 5;
    let stepSize = Math.round(resource.xMax / steps);
    let length = stepSize.toString().length;
    // tslint:disable-next-line:triple-equals
    if (length == 2) {
      length = stepSize.toString().length - 1 ;
    } else {
      length = stepSize.toString().length - 2;
    }
    stepSize = Math.round(stepSize / Math.pow(10, length)) * Math.pow(10, length);

    const tickvals = [];
    const ticktext = [];
    for (let index = 0; index * stepSize <= resource.xMax; index++) {
      const currentStep = index * stepSize;
      tickvals.push(-currentStep);
      ticktext.push(Math.abs(currentStep));
    }

    const layout = {
      title: resource.name ? resource.name + ' ' + resource.version : 'Loading...',
      autosize: true,
      height: 750,
      margin: {l: 0, r: 0, b: 0, t: 50},
      showlegend: false,
      legend: {'orientation': 'h'},

      scene: {
        camera: {
          eye: {x: 2.1, y: 0.9, z: 0.9}
        },
        xaxis: {
          title: 'Eukaryota',
          range: [-resource.xMax, 0],  // workaround
          tickmode : 'array', // workaround
          tickvals : tickvals,  // workaround
          ticktext : ticktext,  // workaround
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
        yaxis: {
          title: 'Archaea',
          range: [0, resource.yMax],
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
        zaxis: {
          title: 'Bacteria',
          range: [0, resource.zMax],
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },

        annotations: [{
          x: -resource.xMax,
          y: resource.yMax,
          z: resource.zMax,
          ax: 0,
          ay: -75,
          text: 'Most abundant domains',
          arrowhead: 1,
          xanchor: 'top',
          yanchor: 'bottom'
        }]
      }
    };
    return layout; // {margin: {l: 0, r: 100, b: 0, t: 0}};
  }


  getHoverText(dataset) {
    const xTitle = this.activeResource.xTitle;
    const yTitle = this.activeResource.yTitle;
    const zTitle = this.activeResource.zTitle;
    const vTitle = this.activeResource.vTitle;
    const xMax = this.activeResource.xMax;
    const yMax = this.activeResource.yMax;
    const zMax = this.activeResource.zMax;
    const vMax = this.activeResource.vMax;
    return dataset.map(function(point) {
      return point.description + '<br>' +
      'Acc : ' + point.acc  + '<br>' +
      xTitle + ' : ' +  point.x + ' (' + ((point.x / xMax) * 100).toFixed(1) + '%)<br>' +
      yTitle + ' : ' +  point.y + ' (' + ((point.y / yMax) * 100).toFixed(1) + '%)<br>' +
      zTitle + ' : ' +  point.z + ' (' + ((point.z / zMax) * 100).toFixed(1) + '%)<br>' +
      vTitle + ' : ' +  point.v + ' (' + ((point.y / vMax) * 100).toFixed(1) + '%)<br>';
    });
  }

  drawChart(dataset, cubeService) {


    const text = this.getHoverText(dataset);
    // const coordinates = this.getXYZ(dataset);
    const layout = this.getLayout(this.activeResource);
    const trace1 = {
      x: this.unpack(dataset, 'x'),
      y: this.unpack(dataset, 'y'),
      z: this.unpack(dataset, 'z'),
      v: this.unpack(dataset, 'v'),
      description: this.unpack(dataset, 'description'),
      acc: this.unpack(dataset, 'acc'),
      highlighted: this.unpack(dataset, 'highlighted'),
      name: this.activeResource.name + ' data',
      mode: 'markers',
      hoverinfo: 'text',
      text: text,
      marker: {
        size: 3,
        name: this.unpack(dataset, 'acc'),
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

    Plotly.purge(element);
    Plotly.newPlot(element, data, layout, [0]);

    // const comp = this;
    element.on('plotly_click', function(point) {
      // console.log(point);
      // comp.highlightPoint(point);
      cubeService.setSelectedPoint(point);
    });

    element.on('plotly_hover', function(dataPoints) {
      const infotext = dataPoints.points.map(function(d) {
        return (d.data.name + ': x= ' + d.x + ', y= ' + d.y.toPrecision(3));
      });

      // someelement.hoverInfo.innerHTML = infotext.join('');
    });


    // Apply copied highlighted points to new data
    dataset.forEach(point => {
      // tslint:disable-next-line:triple-equals
      if (point.highlighted) {
      point.highlighted = false; // highlightPoint(point) sets it true again
       this.highlightPoint(point);
      }
    });
  }

  applyCubeLimits(cubeLimits: CubeLimits) {
    /*
    if (this.cubeLimits && JSON.stringify(this.cubeLimits) == JSON.stringify(cubeLimits) &&
    JSON.stringify(this.activeResource) == JSON.stringify(this.previousResource) ) {
      return this.activeDataSet;
    }*/
    // console.log('applyCubeLimits()');
    this.cubeLimits = cubeLimits;
    this.previousResource = this.activeResource;
    // Make deep copy and remove points from the copyed dataset
    const dataset = JSON.parse(JSON.stringify(this.fullDataSet));

    // Array of indexes
    const indexes = [];

    const xMax = this.activeResource.xMax;
    const yMax = this.activeResource.yMax;
    const zMax = this.activeResource.zMax;
    const vMax = this.activeResource.vMax;

    dataset.forEach(element => {
      const x = (element['x'] / xMax) * 100;
      const y = (element['y']  / yMax) * 100;
      const z = (element['z']  / zMax) * 100;
      if (vMax !== undefined) {
        const v = (element['v']  / vMax) * 100;
      }

      if (x < cubeLimits.xLowerLimit || x > cubeLimits.xUpperLimit ||
          y < cubeLimits.yLowerLimit || y > cubeLimits.yUpperLimit ||
          z < cubeLimits.zLowerLimit || z > cubeLimits.zUpperLimit) {
        const index = dataset.indexOf(element);
        indexes.push(index);

      }

    });

    // Go through in reverse order without messing up the indexes of the yet-to-be-removed items
    indexes.reverse();
    indexes.forEach(index => {
      if (index !== -1) {dataset.splice(index, 1); }
    });

    this.currentDataSet = dataset;
    return dataset;

  }

  resetHighlight() {
    const element = this.el.nativeElement;
    const length = element.data.length;
    const indexes = [];
    for (let i = 1; i < length; i++) {
      indexes.push(i);
      const point = this.currentDataSet.filter(function( obj ) {
        // tslint:disable-next-line:triple-equals
        return obj.acc == element.data[i].name;
      });
      // tslint:disable-next-line:triple-equals
      if (point[0] != undefined) {
        point[0].highlighted = false; // set highlight false
      }
    }
    // Delete all traces
    Plotly.deleteTraces(element, indexes);
  }



}
