import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import { ResourceService } from './../../services/resource.service';
import { CubeService } from '../../services/cube.service';
import {SelectionModel} from '@angular/cdk/collections';
import { Point } from '../../services/resource.service';

@Component({
  selector: 'app-protein-domain-table',
  templateUrl: './protein-domain-table.component.html',
  styleUrls: ['./protein-domain-table.component.scss']
})
export class ProteinDomainTableComponent implements OnInit, OnDestroy {
  displayedColumns = ['acc', 'description', 'x', 'y', 'z', 'v', 'highlighted'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);

  activeResource;
  selectedRow = -1;

  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  resourceSubscription;
  pointsOnCubeSubscription;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private resourceService: ResourceService,
    private cubeService: CubeService
  ) {}

  ngOnDestroy() {
    this.resourceSubscription.unsubscribe();
    this.pointsOnCubeSubscription.unsubscribe();

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.pointsOnCubeSubscription = this.cubeService.getPointsOnCube().subscribe(
      data => {
        // tslint:disable-next-line:triple-equals
        if (data != undefined && data.length > 0) {
          this.dataSource.data = Object.values(data);
        }
      },

      error => console.log(error),
    );

    this.resourceSubscription = this.resourceService.getActiveResource().subscribe(
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

  highlight(point) {
    this.cubeService.setHighlightedPoints([point]);
    this.selectedRow = point.acc; // Last selected row
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
  description: string;
  highlighted: boolean;
  x: number;
  y: number;
  z: number;
  v: number;
}
