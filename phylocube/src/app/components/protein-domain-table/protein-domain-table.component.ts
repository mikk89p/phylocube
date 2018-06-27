import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import { ResourceService } from './../../services/resource.service';
import { CubeService } from '../../services/cube.service';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-protein-domain-table',
  templateUrl: './protein-domain-table.component.html',
  styleUrls: ['./protein-domain-table.component.scss']
})
export class ProteinDomainTableComponent implements OnInit {
  displayedColumns = ['select','acc','x','y','z','v'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);

  activeResource;
  selectedRow: number = -1;
  Math: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private resourceService: ResourceService, 
    private cubeService: CubeService
  ) {this.Math = Math;}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.cubeService.getPointsOnCube().subscribe(
      data => {
        console.log(data);
        this.dataSource.data = Object.values(data);
      },

      error => console.log(error),
    );

    this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
      },
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  highlight(row) {
    console.log(row);
    this.selectedRow = row.acc;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


}

export interface ProteinDomain {
  acc: string;
  x: number;
  y: number;
  z: number;
  v: number;
}
