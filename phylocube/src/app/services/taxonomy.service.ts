import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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

  // private url: String = 'http://localhost:3000/api/v1/';
  private url: String = 'http://bioinfo.ut.ee:3000/api/v1/';

  constructor(private http: HttpClient) { }



  public getTaxons(value: string): Observable<Taxon[]> {
    const url = this.url + 'taxonomy/namelikeorid/' + value;
    return this.http.get<Taxon[]>(url);
  }


  public format(array, text) {
    array.forEach(element => {
      // tslint:disable-next-line:triple-equals
      if (text != undefined && text != '' && text.length > 0) {
        element.formattedName = this.formatText(element.name, text) + ' | Taxonomy ID: '  + this.formatText(element.id, text);
      } else {
        element.formattedName = element.name + ' | Taxonomy ID: ' + element.id;
      }
    });

    return array;
  }

  private formatText(itemText, text) {
    const textMatcher = new RegExp(text, 'ig');
    if (typeof(itemText) === 'number') {itemText = String(itemText); }
    return itemText.replace(textMatcher, function(match) {
      return '<b>' + match + '</b>';
    });

  }
}
