
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Config , Data, Layout} from 'plotly.js';
import * as _ from 'lodash';
@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements OnInit {
  @ViewChild('chart') el: ElementRef;

  constructor() { }

  ngOnInit() {
    this.basicChart();
  }

  basicChart() {
    const element = this.el.nativeElement;
 
    Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/3d-scatter.csv', function(err, rows){
function unpack(rows: any, key) {
	return rows.map(function(row)
	{ return row[key]; });}
    const trace1 = {
      x: unpack(rows, 'x1'), y: unpack(rows, 'y1'), z: unpack(rows, 'z1'),
      mode: 'markers',
      marker: {
        size: 12,
        line: {
        color: 'rgba(217, 217, 217, 0.14)',
        width: 0.5},
        opacity: 0.8},
      type: 'scatter3d'
    };

    const trace2 = {
      x: unpack(rows, 'x2'), y: unpack(rows, 'y2'), z: unpack(rows, 'z2'),
      mode: 'markers',
      marker: {
        color: 'rgb(127, 127, 127)',
        size: 12,
        symbol: 'circle',
        line: {
        color: 'rgb(204, 204, 204)',
        width: 1},
        opacity: 0.8},
      type: 'scatter3d'};
const data = [trace1];
const layout = {margin: {
	l: 0,
	r: 0,
	b: 0,
	t: 0
  }};

Plotly.plot(element, data, layout);
});

}

}
