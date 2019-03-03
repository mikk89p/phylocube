import { ResourceService } from './../../services/resource.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit, OnDestroy {
  // https://www.iconshock.com/colorful-icons/database-icons/database-icon/
  resources = {};
  activeResource;
  selectedValue: string;
  defaultResourceType = 'gene3d';
  defaultResourceVersion = '16.0';


  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  resourceSubscription;


  constructor(
    private resourceService: ResourceService
  ) { }

  ngOnDestroy() {
    this.resourceSubscription.unsubscribe();
  }

  ngOnInit() {
    // Get all available resources. async pipe unsubscribes automatically
    this.resources = this.resourceService.getResources();
    this.resourceSubscription = this.resourceService.getActiveResource().subscribe(
      resource => {
        if (JSON.stringify(resource.id) !== undefined) {
          this.activeResource = resource;
        } else {
          this.resourceService.setActiveResource(this.defaultResourceType, this.defaultResourceVersion);
          this.activeResource = this.defaultResourceType;
        }
      },
    );

  }

  setActiveResource(event, resource) {
    if (event.isUserInput) {
      this.activeResource = resource;
      // console.log(resource);
      this.resourceService.setActiveResource(resource.type, resource.version);
    }
  }

}
