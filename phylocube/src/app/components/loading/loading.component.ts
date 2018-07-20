import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { MainComponent } from '../main/main.component';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {

  loadingText  = 'Loading';
  height: any;

  // Subscriptions
  // When a component/directive is destroyed, all custom Observables need to be unsubscribed manually
  loadingSubscription;

  constructor(private loadingService: LoadingService, public parent: MainComponent) {}

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
  ngOnInit() {

    this.height = this.getHeight() - 64 +  'px';
    this.loadingSubscription = this.loadingService.getLoading().subscribe(
      result => {

        // tslint:disable-next-line:triple-equals
        if (result.length != 0) {
          const loadingText = result[0].text;
          this.height = this.getHeight() - 64 + 'px';
          this.setLoadingText(loadingText);

        } else {
          this.setLoadingText('Loading');
          this.height = this.getHeight() - 64 + 'px';
        }
      }
    );
  }

  setLoadingText(text: string) {
    this.loadingText = text;
  }

  getHeight(): number {
    const body = document.body;
    const html = document.documentElement;
    const height = Math.max( body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
      window.innerHeight
    );
    // console.log('height' + height);
    return height;
  }
}
