// Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  // replaces previous Http service
import { FlexLayoutModule } from '@angular/flex-layout';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { AppRoutingModule } from './app-routing.module';

// Custom modules
import { MaterialModule } from './modules/app.material.module';

// Environment
import { environment } from '../environments/environment';

// Services
import { ResourceService } from './services/resource.service';
import { CubeService } from './services/cube.service';
import { LoadingService } from './services/loading.service';

// Components
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { Error404Component } from './components/error404/error404.component';
import { AboutComponent } from './components/about/about.component';
import { CubeComponent } from './components/cube/cube.component';
import { ResourceComponent } from './components/resource/resource.component';
import { ProteinDomainTableComponent } from './components/protein-domain-table/protein-domain-table.component';
import { ProteinDomainInfoComponent } from './components/protein-domain-info/protein-domain-info.component';
import { CubeManipulationComponent } from './components/cube-manipulation/cube-manipulation.component';
import { AxesSelectionComponent } from './components/axes-selection/axes-selection.component';
import { TaxonomySearchComponent } from './components/taxonomy-search/taxonomy-search.component';
import { LoadingComponent } from './components/loading/loading.component';
import { UniprotSearchComponent } from './components/uniprot-search/uniprot-search.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { ColorSchemeComponent } from './components/color-scheme/color-scheme.component';
import { BrowserCompatibilityComponent } from './components/browser-compatibility/browser-compatibility.component';


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
    LoadingComponent,
    UniprotSearchComponent,
    SearchResultComponent,
    ErrorDialogComponent,
    ColorSchemeComponent,
    BrowserCompatibilityComponent
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
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ResourceService, CubeService, LoadingService],
  bootstrap: [AppComponent],
  entryComponents: [ErrorDialogComponent]
})
export class AppModule { }
