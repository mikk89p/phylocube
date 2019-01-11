import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {

  resources;

  constructor(
    private resourceService: ResourceService
  ) { }

  ngOnDestroy() {

  }

  ngOnInit() {
    // document.body.style.background = 'white';
    this.resources = this.resourceService.getResources();
  }

}
