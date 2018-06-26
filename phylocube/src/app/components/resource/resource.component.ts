import { ResourceService } from './../../services/resource.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {
  // https://www.iconshock.com/colorful-icons/database-icons/database-icon/
  resources = {};
  activeResource;
  selectedValue: string;
  defaultResourceType = 'supfam';
  constructor(private resourceService: ResourceService) { }

  ngOnInit() {
    this.resources = this.resourceService.getResources();
    this.resourceService.setActiveResource(this.defaultResourceType);
    this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
      },
    );

  }

  setActiveResource(event, resource) {
    if (event.isUserInput) {
      this.activeResource = resource;
      this.resourceService.setActiveResource(resource.type);
    }
  }

}
