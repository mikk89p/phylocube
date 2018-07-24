
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ResourceService, Point  } from '../../services/resource.service';
import { CubeService } from '../../services/cube.service';
import { CubeParameters } from './cube-parameters';
import { FormControl } from '../../../../node_modules/@angular/forms';

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

  // Loading
  ready = false;

  // Toggle Buttons
  dynamicAxes = false;
  is2Dplot = false;
  isDensity = false;
  dynamicAxesCtrl = new FormControl(false, []);
  densityCtrl = new FormControl(false, []);
  plotTypeCtrl = new FormControl(false, []);
  densityOptions = [2, 5, 10, 20];
  densityBins = 5;


  fullDataSet;
  currentDataSet; // filtered Dataset
  activeResource;
  previousResource = {};
  previousCubeParameters;
  plotlyEvents = [];
  layout;

  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  resourceSubscription;
  fullDataSubscription;
  pointsOnCubeSubscription;
  highlightSubscription;
  cubeParametersSubscription;
  dynamicAxesSubscription;
  plotTypeSubscription;

  constructor(
    private resourceService: ResourceService,
    private cubeService: CubeService,
  ) {}

  ngOnDestroy() {
    this.resourceSubscription.unsubscribe();
    this.fullDataSubscription.unsubscribe();
    this.pointsOnCubeSubscription.unsubscribe();
    this.highlightSubscription.unsubscribe();
    this.dynamicAxesSubscription.unsubscribe();
    this.plotTypeSubscription.unsubscribe();
    if ( this.cubeParametersSubscription ) {this.cubeParametersSubscription.unsubscribe(); }
  }

  ngOnInit() {


    // Subscriptions

    this.resourceSubscription = this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
      }
    );

    this.cubeParametersSubscription = this.cubeService.getCubeParameters().subscribe(
      cubeParameters => {
        if (cubeParameters !== undefined) {
          this.previousCubeParameters = cubeParameters;
          if (this.currentDataSet !== undefined) {
            this.currentDataSet = this.applyParameters(cubeParameters);
            this.densityCtrl.setValue(false);
            this.cubeService.setPointsOnCube(this.currentDataSet);
          }
        }
      }
    );

    /* Full data is needed for sliders faster interaction */
    this.fullDataSubscription = this.cubeService.getFullData().subscribe(
      data => {
        if (data !== undefined && data.length !== 0) {
          this.fullDataSet = data;
          this.currentDataSet = this.applyParameters(this.cubeService.getCubeParameters().value);
          this.densityCtrl.setValue(false);
          this.cubeService.setPointsOnCube(this.currentDataSet, true);
        }
      }

    );



    this.pointsOnCubeSubscription = this.cubeService.getPointsOnCube().subscribe(
      data => {
        const points = data[0];
        const redraw = data[1];
        if (points !== undefined && points.length !== 0) {
          if (redraw) {
            this.drawChart(points);
          } else {
            this.updateChart(points);
          }

          this.ready = true;
        }
      }
    );

    this.highlightSubscription = this.cubeService.getHighlightedPoints().subscribe(
      result => {
        const points = result.data;
        const description = result.description;
        if (points !== undefined) {
          // if false -> clear all highlight
          if (points === false) {
            this.clearHighlight();
          } else if (points.length > 1) {
            if (points.length < 150) {
              this.currentDataSet.forEach(pointOnCube => {
                for (let i = 0; i < points.length; i++) {
                  if (pointOnCube.acc === points[i].acc) {
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


    this.dynamicAxesSubscription = this.cubeService.getDynamicAxes().subscribe(
      value => {
        this.dynamicAxes = value; // Before setDynamic
        this.setDynamic(value);
        //  A control is dirty if the user has changed the value in the UI.
        if (!this.dynamicAxesCtrl.dirty ) {
          this.dynamicAxesCtrl.setValue(value);
          this.setDynamic(value);
        }
      }
    );

    this.plotTypeSubscription = this.cubeService.getPlotType().subscribe(
      type => {
        this.type = type;
        this.is2Dplot = (type === 'scatter3d') ? false : true;
        if (this.isDensity) {
          this.densityCtrl.setValue (false);
        }

        if (!this.plotTypeCtrl.dirty ) {
          this.plotTypeCtrl.setValue(this.is2Dplot);
        }

        this.cubeService.setPointsOnCube(this.currentDataSet, true);

      }
    );

    // Subscribe to form controls
    this.densityCtrl.valueChanges.subscribe(
      value => {
        if (value === true) {
          this.showDensity();
        // From true to false
        } else if (this.isDensity === true && value === false) {
          this.cubeService.setPointsOnCube(this.currentDataSet, true);
        }
        this.isDensity = value;
      }
    );

    this.dynamicAxesCtrl.valueChanges.subscribe(
      value => {
        this.cubeService.setDynamicAxes(value);
      }
    );

    this.plotTypeCtrl.valueChanges.subscribe(
      value => {
        this.togglePlotType(value);

      }
    );


  }

  unpack(rows, key) {
    const result = rows.map(function(row) {
      if (key === 'x') {
        return -1 * row[key];
      }
      return row[key];
    });

    return result;
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
    if (point.highlighted === undefined || !point.highlighted) {
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

      Plotly.plot(element, [highlight]);
      point.highlighted = true; // Toggle highlight

    } else {
      setTimeout(function() {
        let index = 0;
        const indexes = [];
        element.data.forEach(trace => {
          if (trace.name === point.acc) {
            indexes.push(index);
          }
          index ++;
        });
        // Remove highlight
        Plotly.deleteTraces(element, indexes);
        point.highlighted = false;
      }, 0);
    }
  }

  getAxis(resource) {

    const result = {
      xaxis: {},
      yaxis: {},
      zaxis: {}
    };
    // x-axis is reversed by default and it cannot be changd with autorange: 'reversed',
    // As reversed is not implemented in plotly 3D scatter *-1 is a workaround
    // Therefore, also tickvals should be fixed
    let steps = 5;
    if (resource.xMax < steps) {
      steps = resource.xMax;
    } if (resource.yMax < steps) {
      steps = resource.yMax;
    } if (!this.is2Dplot && resource.zMax < steps) {
      steps = resource.zMax;
    }

    let stepSize = Math.round(resource.xMax / steps);

    let length = stepSize.toString().length;

    if (length === 1) {
      length = 1 ;
      stepSize = 1;
    } else if (length === 2) {
      length = stepSize.toString().length - 1 ;
      stepSize = Math.round(stepSize / Math.pow(10, length)) * Math.pow(10, length);
    } else {
      length = stepSize.toString().length - 2;
      stepSize = Math.round(stepSize / Math.pow(10, length)) * Math.pow(10, length);
    }

    const tickvals = [];
    const ticktext = [];
    for (let index = 0; index * stepSize <= resource.xMax; index++) {
      const currentStep = index * stepSize;
      tickvals.push(-currentStep);
      ticktext.push(Math.abs(currentStep));
    }


    // if dynamic axes
    let autorange = false;
    if (this.dynamicAxes) {
      autorange = true;
    }

    result.xaxis = {
      title: resource.xTitle,
      autorange: autorange,
      range: [-resource.xMax, 0],  // workaround
      tickmode : 'array', // workaround
      tickvals : tickvals,  // workaround
      ticktext : ticktext,  // workaround
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    };
    result.yaxis = {
      title: resource.yTitle,
      autorange: autorange,
      range: [0, resource.yMax],
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    };
    result.zaxis = {
      title: resource.zTitle,
      autorange: autorange,
      range: [0, resource.zMax],
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    };

    return result;
  }


  getLayout(resource) {


    // Get z,y,z axis
    const axes = this.getAxis(resource);

    // Plot params
    const title = resource.name ? resource.name + ' ' + resource.version : 'Loading...';
    const autosize = true;
    const height = (window.innerHeight * 0.6);
    const paper_bgcolor  = 'rgba(0,0,0,0)';
    const plot_bgcolor  = 'rgba(0,0,0,0)';
    const margin = {l: 0, r: 0, b: 0, t: 0};
    const showlegend = false;
    const legend = {'orientation': 'h'};
    const hovermode = 'closest';


    if (this.is2Dplot) {
      return {
        title: title,
        autosize: autosize,
        height: height,
        paper_bgcolor : paper_bgcolor,
        plot_bgcolor : plot_bgcolor,
        margin: margin,
        showlegend: showlegend,
        legend: legend,
        hovermode : hovermode,
        xaxis: axes.xaxis,
        yaxis: axes.yaxis,
      };

    } else {
      return {
        title: title,
        autosize: autosize,
        height: height,
        paper_bgcolor : paper_bgcolor,
        plot_bgcolor : plot_bgcolor,
        margin: margin,
        showlegend: showlegend,
        legend: legend,
        hovermode: hovermode,
        scene: {
          camera: {
            eye: {x: 2.1, y: 0.9, z: 0.9}
          },
          xaxis: axes.xaxis,
          yaxis: axes.yaxis,
          zaxis: axes.zaxis,
        }
      };

    }
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


  getHoverText(dataset) {
    const xTitle = this.activeResource.xTitle;
    const yTitle = this.activeResource.yTitle;
    const zTitle = this.activeResource.zTitle;
    const vTitle = this.activeResource.vTitle;
    const xMax = this.activeResource.xMax;
    const yMax = this.activeResource.yMax;
    const zMax = this.activeResource.zMax;
    const vMax = this.activeResource.vMax;
    const is2Dplot = this.is2Dplot;

    return dataset.map(function(point) {
      let result = point.description + '<br>' +
      'Acc : ' + point.acc  + '<br>' +
      xTitle + ' : ' +  point.x + ' (' + ((point.x / xMax) * 100).toFixed(1) + '%)<br>' +
      yTitle + ' : ' +  point.y + ' (' + ((point.y / yMax) * 100).toFixed(1) + '%)<br>';
      result = is2Dplot ? result : result + (zTitle + ' : ' +  point.z + ' (' + ((point.z / zMax) * 100).toFixed(1) + '%)<br>');
      return result + vTitle + ' : ' +  point.v + ' (' + ((point.y / vMax) * 100).toFixed(1) + '%)<br>';
    });
  }

  getHoverDensityText(dataset) {
    const xTitle = this.activeResource.xTitle;
    const yTitle = this.activeResource.yTitle;
    const is2Dplot = this.is2Dplot;
    return dataset.map(function(point) {
      if ((point.x + point.y + point.z) === 0) {
        return 'Count : ' + point.count  + '<br>' +
        '(0,0,0)';
      }
      let result = 'Count : ' + point.count  + '<br>' +
      xTitle + ' : (' + (point.x - point.stepX / 2).toFixed(0) + ' ; ' + (point.x + point.stepX / 2).toFixed(0) + '] <br>' +
      yTitle + ' : (' + (point.y - point.stepY / 2).toFixed(0) + ' ; ' + (point.y + point.stepY / 2).toFixed(0) + '] <br>';
      // tslint:disable-next-line:max-line-length
      result = is2Dplot ? result : result + 'z : (' + (point.z - point.stepZ / 2).toFixed(0) + ' ; ' + (point.z + point.stepZ / 2).toFixed(0) + ']';
      return result;
    });
  }

  updateChart(dataset) {

    let size = 3;
    if (this.is2Dplot) {
      size = 6;
      this.drawChart(dataset);
      return;
    }

    // If chart do not exist, then drawChart
    const element = this.el.nativeElement;
    if (element.data === undefined) {
      this.drawChart(dataset);
      return;
    }
    const axes = this.getAxis(this.activeResource);

    const updatedTrace = {
      x: [this.unpack(dataset, 'x')],
      y: [this.unpack(dataset, 'y')],
      z: [this.unpack(dataset, 'z')],
      v: [this.unpack(dataset, 'v')],
      /*description: [this.unpack(dataset, 'description')],
      acc: [this.unpack(dataset, 'acc')],
      highlighted: [this.unpack(dataset, 'highlighted')],
      name: this.activeResource.name + ' data',
      mode: 'markers',
      hoverinfo: 'text',
      text: [this.getHoverText(dataset)],
      xaxis: axes.xaxis, // Plotly.deleteTraces -> ERROR TypeError: t.match is not a function
      yaxis: axes.yaxis, // Plotly.deleteTraces -> ERROR TypeError: t.match is not a function
      scene: {
        xaxis: axes.xaxis,
        yaxis: axes.yaxis,
        zaxis: axes.zaxis,
      },*/
      marker: {
        size: size,
        // name: this.unpack(dataset, 'acc'),
        color: this.unpack(dataset, 'color'),
     },
      type: this.type
    };

    Plotly.restyle(element, updatedTrace, [0]);
  }

  drawChart(dataset) {

    const element = this.el.nativeElement;

    let size = 3;
    if (this.is2Dplot) {
      size = 6;
    }
    const opacity = 1;
    let trace;

    // Density
    if (dataset[0].density !== undefined) {
      trace = {
        x: this.unpack(dataset, 'x'),
        y: this.unpack(dataset, 'y'),
        z: this.unpack(dataset, 'z'),
        v: this.unpack(dataset, 'v'),
        count: this.unpack(dataset, 'count'),
        mode: 'markers',
        hoverinfo: 'text',
        text: this.getHoverDensityText(dataset),
        marker: {
          size: this.unpack(dataset, 'size'),
          color: this.defaultColor,
          opacity: opacity},
        type: this.type
      };

    } else {
      trace = {
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
        text: this.getHoverText(dataset),
        marker: {
          size: size,
          name: this.unpack(dataset, 'acc'),
          color: this.unpack(dataset, 'color'),
          opacity: opacity},
        type: this.type
      };

    }
    // USE react
    this.layout = this.getLayout(this.activeResource);
    Plotly.react(element, [trace], this.layout, [0]);


    // Remove previous click listener, should be added once
    element.removeAllListeners('plotly_click');
    const cubeService = this.cubeService;
    if (dataset[0].density === undefined) {
      element.on('plotly_click', function(point) {
        cubeService.setSelectedPoint(point);
      });
    }

    // Apply copied highlighted points to new data
    dataset.forEach(point => {
      if (point.highlighted) {
       setTimeout(() => {
        point.highlighted = false;
        this.highlightPoint(point);
        }, 2);
      }
    });
  }

  applyParameters(cubeParameters: CubeParameters) {
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
    return dataset;
  }

  clearHighlight() {
    const element = this.el.nativeElement;
    const length = element.data.length;
    const indexes = [];
    for (let i = 1; i < length; i++) {
      indexes.push(i);
      const point = this.currentDataSet.filter(function( obj ) {
        return obj.acc === element.data[i].name;
      });
      if (point[0] !== undefined) {
        point[0].highlighted = false; // set highlight false
      }
    }
    // Delete all traces
    Plotly.deleteTraces(element, indexes);
  }


getMin (arg1, arg2) {
  if (arg1 <= arg2) {
    return arg1;
  } else {
    return arg2;
  }
}

getMax (arg1, arg2) {
  if (arg1 >= arg2) {
    return arg1;
  } else {
    return arg2;
  }
}

getDensityRadius (rawVal) {
  return Math.log2(rawVal) + Math.log2(rawVal) + 2;
}

getMinMaxXYZ (dataset) {
  const array = [];
  // Default values
  const result = {
    minX: 99999,
    minY: 99999,
    minZ: 99999,
    maxX: 0,
    maxY: 0,
    maxZ: 0
  };

  dataset.forEach(point => {
    result.minX = this.getMin(point.x, result.minX);
    result.minY = this.getMin(point.y, result.minY);
    result.minZ = this.getMin(point.z, result.minZ);
    result.maxX = this.getMax(point.x, result.maxX);
    result.maxY = this.getMax(point.y, result.maxY);
    result.maxZ = this.getMax(point.z, result.maxZ);
  });

  return result;
}

showDensity() {
  const bins = this.densityBins;

  const minMaxXYZ = this.getMinMaxXYZ(this.currentDataSet);
  const minX = minMaxXYZ.minX;
  const maxX = minMaxXYZ.maxX;
  const minY = minMaxXYZ.minY;
  const maxY = minMaxXYZ.maxY;
  const minZ = minMaxXYZ.minZ;
  const maxZ = minMaxXYZ.maxZ;

  const stepX = (maxX - minX) / bins;
  const stepY = (maxY - minY) / bins;
  const stepZ = (maxZ - minZ) / bins;

  const dict = {};
  this.currentDataSet.forEach(point => {
    let key;
    let x = Math.round(point.x / stepX);
    let y = Math.round(point.y / stepY);
    let z = this.is2Dplot ? 0 : Math.round(point.z / stepZ);
    if ((point.x + point.y + point.z) === 0) {
      key = 'zero_corner';
      x = 0;
      y = 0;
      z = 0;
    } else {
      key = this.is2Dplot ? x + '' + y : x + '' + y + '' + z;
      x = x * stepX + stepX / 2;
      y = y * stepY + stepY / 2;
      z = this.is2Dplot ? 0 : (z * stepZ + stepZ / 2);
    }

    if (dict[key]) {
      dict[key].points.push(point);
      dict[key].size = this.getDensityRadius (dict[key].points.length);
      dict[key].count = dict[key].count + 1;
    } else {
      let densityPoint: DensityPoint;
      densityPoint = {
        x: x,
        y: y,
        z: this.is2Dplot ? 0 : z,
        stepX: stepX,
        stepY: stepY,
        stepZ: this.is2Dplot ? 0 : stepZ,
        size: this.getDensityRadius (1),
        count: 1,
        points: [point],
        density: true // DO NOT REMOVE. IT IS USED TO CHECK IF DATA IS DENSITY
      };
      dict[key] = densityPoint;
    }

  });

  const array = [];
  Object.keys(dict).forEach(function(key) {
    const value = dict[key];
    array.push(value);
});
  this.cubeService.setPointsOnCube(array, true);


}

setDynamic(value: boolean) {
  const element = this.el.nativeElement;
  if (value === true) {
    if (this.is2Dplot) {
      Plotly.relayout(element, 'xaxis.autorange', true);
      Plotly.relayout(element, 'yaxis.autorange', true);
    } else {
      Plotly.relayout(element, 'scene.xaxis.autorange', true);
      Plotly.relayout(element, 'scene.yaxis.autorange', true);
      Plotly.relayout(element, 'scene.zaxis.autorange', true);
    }
  } else {
    if (this.is2Dplot) {
      Plotly.relayout(element, 'xaxis.autorange', false);
      Plotly.relayout(element, 'yaxis.autorange', false);
      this.drawChart(this.currentDataSet);
    } else {
      Plotly.relayout(element, 'scene.xaxis.autorange', false);
      Plotly.relayout(element, 'scene.yaxis.autorange', false);
      Plotly.relayout(element, 'scene.zaxis.autorange', false);
    }
  }
}

togglePlotType(value: boolean) {

  if (value === true) {
    this.cubeService.setPlotType('scatter');
  } else {
    this.cubeService.setPlotType('scatter3d');
  }
}


setDensityOption(event, densityOption) {
  if (event.isUserInput) {
    this.densityBins = densityOption;
  }
}

}

export interface DensityPoint {
  x: number;
  y: number;
  z: number;
  stepX: number;
  stepY: number;
  stepZ: number;
  size: number;
  count: number;
  points: Point[];
  density: boolean; // DO NOT REMOVE. IT IS USED TO CHECK IF DATA IS DENSITY

}



