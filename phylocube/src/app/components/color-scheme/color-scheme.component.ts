import { Component, OnInit, OnDestroy, ViewChild, ElementRef  } from '@angular/core';
import { ResourceService } from './../../services/resource.service';
import { CubeService } from '../../services/cube.service';

@Component({
  selector: 'app-color-scheme',
  templateUrl: './color-scheme.component.html',
  styleUrls: ['./color-scheme.component.scss']
})
export class ColorSchemeComponent implements OnInit, OnDestroy {

  activeResource;
  isDisabled = false;
  public colorSchemes = [
    {
      id: 0,
      name: 'None',
      description: 'Default color scheme'
    },
    {
      id: 1,
      name: 'Binary',
      description: 'Domain is present in at least one virus genome<i class="material-icons fold-red">color_lens</i><br>'
    },
    {
      id: 2,
      name: 'Multiple',
      description: `In only one virus genome<i class="material-icons fold-red">color_lens</i><br>
      In more than 1 virus genome<i class="material-icons fold-blue" >color_lens</i><br>
      `
    },
    {
      id: 3,
      name: 'By Fold class',
      description: ''
    },



  ];
  public activeColorScheme = 0;

  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  resourceSubscription;
  pointsOnCubeSubscription;
  cubeParametersSubscription;


  constructor(
    private resourceService: ResourceService,
    private cubeService: CubeService
  ) {}

  ngOnDestroy() {
    this.resourceSubscription.unsubscribe();
    this.cubeParametersSubscription.unsubscribe();
  }

  ngOnInit() {
    this.resourceSubscription = this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
        if ( resource.type === 'gene3d') {
          this.isDisabled = false;
          this.colorSchemes[3].description = `Mainly Alpha<i class="material-icons fold-red" >color_lens</i><br>
            Mainly Beta<i class="material-icons fold-green">color_lens</i><br>
            Alpha and Beta<i class="material-icons fold-blue">color_lens</i><br>
            Few Secondary structures<i class="material-icons fold-dark-green">color_lens</i><br>`;
        } else if ( resource.type === 'supfam') {
          this.isDisabled = false;
          this.colorSchemes[3].description = `
          All alpha proteins<i class="material-icons fold-red" >color_lens</i><br>
          All beta protein<i class="material-icons fold-green">color_lens</i><br>
          Alpha and beta proteins (a/b)<i class="material-icons fold-blue">color_lens</i><br>
          Alpha and beta proteins (a+b)<i class="material-icons fold-yellow">color_lens</i><br>
          Multi-domain proteins (alpha and beta)<i class="material-icons fold-cyan">color_lens</i><br>
          Membrane and cell surface proteins and peptides<i class="material-icons fold-magenta">color_lens</i><br>
          Small proteins<i class="material-icons fold-silver">color_lens</i><br>
          Coiled coil proteins<i class="material-icons fold-dark-yellow">color_lens</i><br>
          Low resolution protein structures<i class="material-icons fold-dark-green">color_lens</i><br>
          Peptides<i class="material-icons fold-purple">color_lens</i><br>
          esigned proteins<i class="material-icons fold-navy">color_lens</i><br>`;
       } else {
         this.colorSchemes[3].description = 'Unavailable';
         this.isDisabled = true;
       }
      },
    );

    // If user comes back from about page
    this.cubeParametersSubscription = this.cubeService.getCubeParameters().subscribe(
        cubeParameters => {
          if (cubeParameters && Object.keys(cubeParameters).length !== 0) {
            this.activeColorScheme = cubeParameters.colorScheme;
          }
        }
      );
  }

  radioChange(event) {
    this.cubeService.setColorScheme(event.value);
}

}
