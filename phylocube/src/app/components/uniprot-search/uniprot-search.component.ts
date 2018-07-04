import { Component, OnInit } from '@angular/core';
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
export class UniprotSearchComponent implements OnInit {

  activeResource;
  form: FormGroup;
  uniprotId = new FormControl('', [Validators.required, Validators.minLength(5)]);
  submitted = false;


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

  ngOnInit() {

    this.resourceService.getActiveResource().subscribe(
      resource => {
        this.activeResource = resource;
      },
    );

  }



  onSubmit() {
    this.submitted = true;
    const uniprotID = this.form.value.uniprotId;
    console.log(uniprotID); // P12345
    this.resourceService.getAccByUniprotId( uniprotID).subscribe(
      data => {
        let result = [];
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
          if (attribute['type'] == activeResourceType) {
            let acc = attribute['id'];
            if (this.activeResource.type == 'supfam') {
              // SSF53383 - TODO
              acc = acc.replace('SSF', '');
              result.push(acc);

            } else if (this.activeResource.type == 'clan' || this.activeResource.type == 'clanpfam') {

              this.resourceService.getClanByPfamAcc(acc).subscribe(
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
                }
              );
            } else {
              result.push(acc);
              this.resourceService.setSearchResult(result);
            }
          }
        });

        

      },
      err => {
        console.log(err);
        this.loadingService.openDialog('Error', err.statusText);
      },
      () => { this.submitted = false; }
    );
  }

}
