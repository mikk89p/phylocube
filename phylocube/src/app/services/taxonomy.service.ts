import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from './../../environments/environment';


export interface Taxon {
  id: number;
  name: string;
  rank: string;
  parent_id?: number;
  full_taxonomy?: string;
  full_taxonomy_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }



  public getTaxons(value: string): Observable<Taxon[]> {
    const url = this.apiUrl + 'taxonomy/namelikeorid/' + value;
    return this.http.get<Taxon[]>(url);
  }


  public format(array, text) {
    if (array) {
      array.forEach(element => {
        // tslint:disable-next-line:triple-equals
        if (text != undefined && text != '' && text.length > 0) {
          element.formattedName = this.formatText(element.name, text) + ' | Taxonomy ID: ' + this.formatText(element.id, text);
        } else {
          element.formattedName = element.name + ' | Taxonomy ID: ' + element.id;
        }
      });
    }


    return array;
  }

  private formatText(itemText, text) {
    console.log(itemText);
    const textMatcher = new RegExp(text, 'ig');
    if (typeof (itemText) === 'number') { itemText = String(itemText); }
    return itemText.replace(textMatcher, function (match) {
      return '<b>' + match + '</b>';
    });

  }
}
