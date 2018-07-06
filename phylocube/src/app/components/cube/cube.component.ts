
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
// import {Config , Data, Layout} from 'plotly.js';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { ResourceService } from '../../services/resource.service';
import { CubeService } from '../../services/cube.service';
import { CubeParameters } from './cube-parameters';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})

export class CubeComponent implements OnInit, OnDestroy {
  @ViewChild('chart') el: ElementRef;

  // chart options
  type = 'scatter3d';
  defaultColor = 'rgb(0, 0, 0)';
  ready = false;

  fullDataSet;
  currentDataSet; // filtered Dataset
  activeResource;
  previousResource = {};
  previousCubeParameters;
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
    private cubeService: CubeService,
    private snackBar: MatSnackBar,
    private zone: NgZone
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
        if (data.length > 0) {
          this.fullDataSet = data;
          this.cubeService.getCubeParameters().subscribe(
            cubeParameters => {
              if (cubeParameters) {
                this.previousCubeParameters = cubeParameters;
                this.applyParameters(cubeParameters);
                this.cubeService.setPointsOnCube(this.currentDataSet);
              }
            }
          );
        }
      }
    );

    this.pointsOnCubeSubscription = this.cubeService.getPointsOnCube().subscribe(
      data => {
        if (data !== undefined && data.length !== 0) {
          this.drawChart(data, this.cubeService);
          this.ready = true;
        }
      }
    );

    this.highlightSubscription = this.cubeService.getHighlightedPoints().subscribe(
      result => {
        const points = result.data;
        const description = result.description;
        // tslint:disable-next-line:triple-equals
        if (points != undefined) {
          // if false -> clear all highlight
          if (points === false) {
            this.clearHighlight();
          } else if (points.length > 1) {
            if (points.length < 150) {
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


    this.selectedPointSubscription = this.cubeService.getSelectedPoint().subscribe(
      point => {
        if (point.acc !== undefined) {
          // this.openSnackBar(point);
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
        type: this.type
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
          type: this.type
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
      height: (window.innerHeight * 0.7),
      paper_bgcolor : 'rgba(0,0,0,0)',
      plot_bgcolor : 'rgba(0,0,0,0)',
      margin: {l: 0, r: 0, b: 0, t: 0},
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

        /*annotations: [{
          x: -resource.xMax,
          y: resource.yMax,
          z: resource.zMax,
          ax: 0,
          ay: -75,
          text: 'Most abundant domains',
          arrowhead: 1,
          xanchor: 'top',
          yanchor: 'bottom'
        }] */
      }
    };
    return layout;
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

    const size = 3;
    const opacity = 0.5;
    const text = this.getHoverText(dataset);
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
        size: size,
        name: this.unpack(dataset, 'acc'),
        color: this.unpack(dataset, 'color'),
        opacity: opacity},
      type: this.type
    };
    const data = [trace1];
    const element = this.el.nativeElement;

    Plotly.purge(element);
    Plotly.newPlot(element, data, layout, [0]);

    element.on('plotly_click', function(point) {
      cubeService.setSelectedPoint(point);
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

  applyParameters(cubeParameters: CubeParameters) {
    /*
    if (this.cubeParameters && JSON.stringify(this.cubeParameters) == JSON.stringify(cubeParameters) &&
    JSON.stringify(this.activeResource) == JSON.stringify(this.previousResource) ) {
      return this.activeDataSet;
    }*/
   
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

      // Apply color
      element['color'] = this.defaultColor;

      if (cubeParameters.colorScheme === 1) {
        if (element['v'] > 0) {
          element['color'] = 'rgb(250, 0, 0)';
        }
      } else if (cubeParameters.colorScheme === 2) {
        if (element['v'] > 0) {
          element['color'] = 'rgb(250, 0, 0)';
          if (element['v'] > 1) {
            element['color'] = 'rgb(0, 0, 250)';
          }
        }

      }

      if (x < cubeParameters.xLowerLimit || x > cubeParameters.xUpperLimit ||
          y < cubeParameters.yLowerLimit || y > cubeParameters.yUpperLimit ||
          z < cubeParameters.zLowerLimit || z > cubeParameters.zUpperLimit) {
        const index = dataset.indexOf(element);
        indexes.push(index);
      }

    });

    // Go through in reverse order without messing up the indexes of the yet-to-be-removed items
    if (indexes.length > 0) {
      indexes.reverse();
      indexes.forEach(index => {
        if (index !== -1) {dataset.splice(index, 1); }
      });
    }

    this.currentDataSet = dataset;
    return dataset;
  }

  clearHighlight() {
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

  public openSnackBar(point): void {
    this.zone.run(() => {
      const text = point.acc;
      const snackBar = this.snackBar.open(text, 'Highlight', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
      snackBar.onAction().subscribe(() => {
        this.cubeService.setHighlightedPoints([point]);
        snackBar.dismiss();
      });
    });
  }


}



