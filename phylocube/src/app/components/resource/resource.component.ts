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
  activeResource = false;
  selectedValue: string;
  constructor(private resourceService: ResourceService) { }

  ngOnInit() {
    this.resources = this.resourceService.getResources();
    this.resourceService.getResourceById(1).subscribe(
      resource => {
        this.setActiveResource(resource);
      },

      error => console.log(error),
    );
  }

  setActiveResource(resource) {
    this.activeResource = resource;
    // TODO set active resource global
    // setActiveResource(resource.id);
  }

  onChange(event, resource) {
    if (event.isUserInput) {
      console.log(resource);
      this.setActiveResource(resource);
   }
}

}
