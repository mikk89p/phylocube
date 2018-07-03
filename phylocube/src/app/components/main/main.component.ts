import { Component, OnInit, ViewChild } from '@angular/core';
import { ResourceService } from '../../services/resource.service';
import { CubeService } from '../../services/cube.service';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  showLoading = false;

  constructor(
    private resourceService: ResourceService,
    private cubeService: CubeService,
    private loadingService: LoadingService
  ) {}


  ngOnInit() {
    this.loadingService.getLoading().subscribe(
      result => {

        // tslint:disable-next-line:triple-equals
        if (result.length != 0) {
          this.showLoading = true;
        } else {
          this.showLoading = false;
        }
      }
    );

  }

}
