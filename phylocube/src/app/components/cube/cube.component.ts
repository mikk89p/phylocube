
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
  fullDataSet;
  // filtered Dataset
  currentDataSet;
  activeResource;
  previousResource = {};
  cubeLimits;
  plotlyEvents = [];

  constructor(
    private resourceService: ResourceService,
    private cubeService: CubeService
  ) {}

  ngOnInit() {
    this.resourceService.getActiveResource().subscribe(
      resource => {
        // console.log('Cube component getActiveResource()');
        this.activeResource = resource;
      }
    );

    /* Full data is needed for sliders faster interaction */
    this.cubeService.getFullData().subscribe(
      data => {
        this.fullDataSet = data;
        data = this.applyCubeLimits(this.cubeLimits);
        this.cubeService.setPointsOnCube(data);
      }
    );
    /*
    this.resourceService.getData().subscribe(
      data => {
          // console.log('Cube component getData()');
          this.fullDataSet = data;
          data = this.applyCubeLimits(this.cubeLimits);
          this.cubeService.setPointsOnCube(data);
      }
    );
*/
    this.cubeService.getPointsOnCube().subscribe(
      data => {
        if (data !== undefined && data.length !== 0) {
          // console.log('Cube component getPointsOnCube()');
          this.drawChart(data, this.cubeService);
        }
      }
    );

    this.cubeService.getHighlightedPoints().subscribe(
      result => {
        const points = result.data;
        const description = result.description;
        if (points != undefined || points.length > 1) {
          if (points.length > 1) {
            if (points.length < 250) {
              this.currentDataSet.forEach(pointOnCube => {
                for (let i = 0; i < points.length; i++) {
                  // tslint:disable-next-line:triple-equals
                  if (pointOnCube.acc == points[i].acc) {
                    this.highlightPoint(pointOnCube);
                  }
                }
              });
            } else {
              this.highlightMultiplePoints(points, description);
            }
            /*const highlightPointsOnCube = [];
            this.currentDataSet.forEach(pointOnCube => {
              for (let i = 0; i < points.length; i++) {
                // tslint:disable-next-line:triple-equals
                if (pointOnCube.acc == points[i].acc) {
                  highlightPointsOnCube.push(pointOnCube);
                }
              }
            });
            this.highlightMultiplePoints(highlightPointsOnCube, description);
            */
          } else {
            const point = points[0];
            this.highlightPoint(point);
          }

        }
      }
    );

    this.cubeService.getSelectedPoint().subscribe(
      point => {
        // tslint:disable-next-line:triple-equals
        if (point != undefined) {
          // TODO
          // this.highlightPoint(point);
        }
      }
    );

    this.cubeService.getCubeLimits().subscribe(
      cubeLimits => {
        if (Object.keys(cubeLimits).length !== 0) {
          const data = this.applyCubeLimits(cubeLimits);
          this.cubeService.setPointsOnCube(data);
        }
      }
    );
  }

  unpack(rows, key) {
    return rows.map(function(row) {
      return row[key];
    });
  }


  highlightMultiplePoints(points, description) {
    if (points === undefined || points.length === 0 || JSON.stringify(points) === JSON.stringify({})) {return; }

    const element = this.el.nativeElement;
    points.forEach(point => {
      if (point.highlighted == undefined || !point.highlighted) {
        point.highlighted = true; // Toggle highlight
      } else {
        point.highlighted = false;
      }

    });

    const highlight = {
      x: this.unpack(points, 'x'),
      y: this.unpack(points, 'y'),
      z: this.unpack(points, 'z'),
      acc: this.unpack(points, 'acc'),
      is_highlight: true,
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
    if (point.highlighted == undefined || !point.highlighted) {
      const highlight = {
        x: this.unpack([point], 'x'),
        y: this.unpack([point], 'y'),
        z: this.unpack([point], 'z'),
        acc: this.unpack([point], 'acc'),
        is_highlight: true,
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


  getXYZ(proteinDomainData) {
    const x = [];
    const y = [];
    const z = [];
    const acc = [];

    proteinDomainData.forEach(function (row) {
      x.push(row.x);
      y.push(row.y);
      z.push(row.z);
      acc.push(row.acc);
    });
    // x = x.map(x => x * -1);
    return {x: x, y: y, z: z, acc: acc};

  }

  getLayout(resource) {
    /*
      eukaryota_genomes = x
      archaea_genomes = y
      bacteria_genomes = z
      virus_genomes = v
    */
    const layout = {
      title: resource.name ? resource.name + ' ' + resource.version : 'Loading...',
      autosize: false,
      width: 800,
      height: 700,
      margin: {l: 0, r: 0, b: 0, t: 50},
      showlegend: false,
      legend: {'orientation': 'h'},
      scene: {
        xaxis: {
          // autorange: 'reversed',
          title: 'Eukaryota',
          range: [0, resource.xMax],
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
        }
      }
    };
    return layout; // {margin: {l: 0, r: 100, b: 0, t: 0}};
  }




  drawChart(dataset, cubeService) {
    // const coordinates = this.getXYZ(dataset);
    const layout = this.getLayout(this.activeResource);
    const trace1 = {
      x: this.unpack(dataset, 'x'),
      y: this.unpack(dataset, 'y'),
      z: this.unpack(dataset, 'z'),
      acc: this.unpack(dataset, 'acc'),
      highlighted: this.unpack(dataset, 'highlighted'),
      name: this.activeResource.name + ' data',
      mode: 'markers',
      marker: {
        size: 3,
        /* fill color */
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

    const highlight = function(a) {this.highlightPoint(a); };

    element.on('plotly_click', function(point) {
      // console.log(point);
      // cubeService.setHighlightedPoint(point);
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
        return obj.acc == element.data[i].name;
      });
      if (point[0] != undefined) {
        point[0].highlighted = false; // set highlight false
      }
    }
    // Delete all traces
    Plotly.deleteTraces(element, indexes);
  }



}
