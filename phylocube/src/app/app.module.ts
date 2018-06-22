import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MaterialModule } from './modules/app.material.module';
import { HttpClientModule } from '@angular/common/http';  // replaces previous Http service
import { FlexLayoutModule } from '@angular/flex-layout';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { Error404Component } from './components/error404/error404.component';
import { AboutComponent } from './components/about/about.component';
import { CubeComponent } from './components/cube/cube.component';
import { ProteinDomainService } from './services/protein-domain.service';
import { ResourceService } from './services/resource.service';
import { ResourceComponent } from './components/resource/resource.component';
import { ProteinDomainTableComponent } from './components/protein-domain-table/protein-domain-table.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    FooterComponent,
    Error404Component,
    AboutComponent,
    CubeComponent,
    ResourceComponent,
    ProteinDomainTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [ResourceService, ProteinDomainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
