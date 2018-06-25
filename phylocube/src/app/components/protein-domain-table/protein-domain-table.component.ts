import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort} from '@angular/material';
import { ResourceService } from './../../services/resource.service';

@Component({
  selector: 'app-protein-domain-table',
  templateUrl: './protein-domain-table.component.html',
  styleUrls: ['./protein-domain-table.component.scss']
})
export class ProteinDomainTableComponent implements OnInit {
  displayedColumns = ['acc',
                      'archaea',
                      //'archaea_genomes',
                      'bacteria',
                      //'bacteria_genomes',
                      'eukaryota',
                      //'eukaryota_genomes',
                      'virus',
                      //'virus_genomes'
                    ];
  dataSource = new MatTableDataSource();
  activeResource;
  selectedRow: number = -1;

  @ViewChild(MatSort) sort: MatSort;


  constructor(private resourceService: ResourceService) { }

  ngOnInit() {
    this.resourceService.getData().subscribe(
      data => {
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
  description: string;
  archaea: number;
  bacteria: number;
  eukaryota: number;
  virus: number;
  archaea_genomes: number;
  bacteria_genomes: number;
  eukaryota_genomes: number;
  virus_genomes: number;

}
