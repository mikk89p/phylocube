import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService } from './../../services/resource.service';
import { CubeService } from '../../services/cube.service';

@Component({
  selector: 'app-color-scheme',
  templateUrl: './color-scheme.component.html',
  styleUrls: ['./color-scheme.component.scss']
})
export class ColorSchemeComponent implements OnInit, OnDestroy {

  activeResource;
  public colorSchemes: Object[] = [
    {id: 0, name: 'None',  description: 'Default color scheme'},
    {id: 1, name: 'Binary', description: 'Red : Domain is present in at least one virus genome'},
    // tslint:disable-next-line:max-line-length
    {id: 2, name: 'Multiple', description: 'Blue: In more than 1 virus genome. Red: At least in one virus genome.'}
  ];
  private activeColorScheme = 0;

  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  resourceSubscription;
  pointsOnCubeSubscription;


  constructor(
    private resourceService: ResourceService,
    private cubeService: CubeService
  ) {}

  ngOnDestroy() {
    this.resourceSubscription.unsubscribe();
  }

  ngOnInit() {
    this.resourceSubscription = this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
      },
    );
  }

  radioChange(event) {
    this.cubeService.setColorScheme(event.value);
}

}
