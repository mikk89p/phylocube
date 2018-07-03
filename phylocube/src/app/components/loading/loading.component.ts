import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  loadingText  = 'Loading';

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.getLoading().subscribe(
      result => {

        // tslint:disable-next-line:triple-equals
        if (result.length != 0) {
          const loadingText = result[0].text;
          this.setLoadingText(loadingText);

        } else {
          this.setLoadingText('Loading');
        }
      }
    );
  }

  setLoadingText(text: string) {
    this.loadingText = text;
  }

}
