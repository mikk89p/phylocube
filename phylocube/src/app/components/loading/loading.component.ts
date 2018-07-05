import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {

  loadingText  = 'Loading';
  innerHeight: any;

    // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  loadingSubscription;

  constructor(private loadingService: LoadingService) {
    // TODO
    //this.innerHeight = (screen.height) + 'px';
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
  ngOnInit() {
    this.innerHeight = (window.innerHeight) + 'px';
    this.loadingSubscription = this.loadingService.getLoading().subscribe(
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
