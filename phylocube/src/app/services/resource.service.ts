import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private url: String = 'http://localhost:3000';

  constructor(private http: HttpClient) {}


  getAllResources() {
    // tslint:disable-next-line:max-line-length
    return [{"id":1,"type":"gene3d","name":"Gene3D","description":"Gene3D takes CATH domain families (from PDB structures) and assigns them to the millions protein sequences (using Hidden Markov models generated from HMMER) with no PDB structures","version":"16.0","url":null,"classification_version":"CATH 4.2.0","cellular_genomes":"UniprotKB reference proteomes 2017_08","viral_genomes":"UniprotKB reference proteomes 2017_08"},{"id":2,"type":"supfam","name":"SUPERFAMILY","description":"The SUPERFAMILY annotation is based on a collection of hidden Markov models, which represent structural protein domains at the SCOP superfamily level.","version":"1.75","url":"http://supfam.org/SUPERFAMILY/index.html","classification_version":"SCOP 1.75","cellular_genomes":"Uniprot complete proteomes 2014_01","viral_genomes":"NCBI viral sequence collection (2014-08-20)"},{"id":3,"type":"pfam","name":"Pfam 31.0","description":"The Pfam database is a large collection of protein families, each represented by multiple sequence alignments and hidden Markov models (HMMs).","version":"31.0","url":"https://pfam.xfam.org/","classification_version":"Pfam 31.0","cellular_genomes":"UniprotKB reference proteomes 2016_10","viral_genomes":"UniprotKB reference proteomes 2016_10"},{"id":4,"type":"clan","name":"Clans from Pfam 31.0","description":"Clans in Pfam database are groupings of related families that share a single evolutionary origin, as confirmed by structural, functional, sequence and HMM comparisons","version":"31.0","url":"https://pfam.xfam.org/clan/browse","classification_version":"Clans from Pfam 31.0","cellular_genomes":"UniprotKB reference proteomes 2016_10","viral_genomes":"UniprotKB reference proteomes 2016_10"},{"id":5,"type":"clanpfam","name":"Clans and pfam from Pfam 31.0","description":"All clan assignments from Pfam database including Pfam assignments which are not assigned to a clan.","version":"31.0","url":"https://pfam.xfam.org/","classification_version":"Clans from Pfam 31.0","cellular_genomes":"UniprotKB reference proteomes 2016_10","viral_genomes":"UniprotKB reference proteomes 2016_10"}];
  }

  getResources() {
    console.log ('getResources()');
    const uri = this.url + '/resource/';
    return this.http.get(uri).map(res => {
      return res;
    });
  }

  getResourceById(id: number) {
    console.log ('getResourceById()');
    const uri = this.url + '/resource/' + id;
    return this.http.get(uri).map(res => {
      return res[0];
    });
  }
}
