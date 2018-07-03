import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MaterialModule } from './modules/app.material.module';
import { HttpClientModule } from '@angular/common/http';  // replaces previous Http service
import { FlexLayoutModule } from '@angular/flex-layout';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { Error404Component } from './components/error404/error404.component';
import { AboutComponent } from './components/about/about.component';
import { CubeComponent } from './components/cube/cube.component';
import { ResourceService } from './services/resource.service';
import { CubeService } from './services/cube.service';
import { ResourceComponent } from './components/resource/resource.component';
import { ProteinDomainTableComponent } from './components/protein-domain-table/protein-domain-table.component';
import { ProteinDomainInfoComponent } from './components/protein-domain-info/protein-domain-info.component';
import { CubeManipulationComponent } from './components/cube-manipulation/cube-manipulation.component';
import { AxesSelectionComponent } from './components/axes-selection/axes-selection.component';
import { TaxonomySearchComponent } from './components/taxonomy-search/taxonomy-search.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingService } from './services/loading.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavComponent,
    FooterComponent,
    Error404Component,
    AboutComponent,
    CubeComponent,
    ResourceComponent,
    ProteinDomainTableComponent,
    ProteinDomainInfoComponent,
    CubeManipulationComponent,
    AxesSelectionComponent,
    TaxonomySearchComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [ResourceService, CubeService, LoadingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
