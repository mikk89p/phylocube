import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TaxonomyService } from '../../services/taxonomy.service';
import { CubeService } from '../../services/cube.service';
import { ResourceService } from '../../services/resource.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-uniprot-search',
  templateUrl: './uniprot-search.component.html',
  styleUrls: ['./uniprot-search.component.scss']
})
export class UniprotSearchComponent implements OnInit, OnDestroy {

  activeResource;
  form: FormGroup;
  uniprotId = new FormControl('', [Validators.required, Validators.minLength(5)]);
  submitted = false;

  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  resourceSubscription;
  uniprotSubscription;
  clanSubscription;



  constructor(
    private cubeService: CubeService,
    private resourceService: ResourceService,
    private taxonomyService: TaxonomyService,
    private loadingService: LoadingService,
    fb: FormBuilder) {

    this.form = fb.group({
      'uniprotId': this.uniprotId
    });

  }

  ngOnDestroy() {
    this.resourceSubscription.unsubscribe();
    if (this.uniprotSubscription) { this.uniprotSubscription.unsubscribe(); }
    if (this.clanSubscription) { this.clanSubscription.unsubscribe(); }
  }

  ngOnInit() {

    this.resourceSubscription = this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
      },
    );
  }

  onSubmit() {
    this.submitted = true;
    const uniprotID = this.form.value.uniprotId;

    if (this.uniprotSubscription) { this.uniprotSubscription.unsubscribe(); }
    if (this.clanSubscription) { this.clanSubscription.unsubscribe(); }

    this.uniprotSubscription = this.resourceService.getAccByUniprotId( uniprotID).subscribe(
      data => {
        const result = [];
        const arr = data['uniprot']['entry']['dbReference'];

        // Uniprot types
        let activeResourceType = '';
        if (this.activeResource.type == 'pfam' || this.activeResource.type == 'clan' || this.activeResource.type == 'clanpfam'){
          activeResourceType = 'Pfam';
        } else if (this.activeResource.type == 'supfam') {
          activeResourceType = 'SUPFAM';
        } else if (this.activeResource.type == 'gene3d') {
          activeResourceType = 'Gene3D';
        }

        arr.forEach(element => {
          const attribute = element['@attributes'];

          // Look domains only for activeResource
          if (attribute['type'] != activeResourceType) { return; }

          let acc = attribute['id'];

          if (activeResourceType == 'Gene3D') {
            result.push(acc);
          } else if (activeResourceType == 'SUPFAM') {
              acc = acc.replace('SSF', '');
              result.push(acc);
          } else if (activeResourceType == 'Pfam' ) {
            if (this.activeResource.type == 'pfam') {
              result.push(acc);
            } else {
              // clan and clanpfam
              this.clanSubscription = this.resourceService.getClanByPfamAcc(acc).subscribe(
                clan_acc => {
                  if (clan_acc) {
                    result.push(clan_acc['clan_acc']);
                  } else if (this.activeResource.type == 'clanpfam') {
                    result.push(acc);
                  }
                  this.resourceService.setSearchResult(result);
                },
                err => {
                  console.log(err);
                },
              );
            }
          }

          // In case of clan and clanpfam resource there is extra query
          if (this.activeResource.type != 'clan' && this.activeResource.type != 'clanpfam') {
            this.resourceService.setSearchResult(result);
          }

        });

        this.submitted = false;
      },
      err => {
        console.log(err);
        this.submitted = false;
        this.loadingService.openDialog('Error', err.statusText);
      },

      //() => { this.submitted = false; }
    );
  }

}
