import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { AboutComponent } from './components/about/about.component';
import { Error404Component} from './components/error404/error404.component';
const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'about', component: AboutComponent},
  {path: '**', component: Error404Component} // catch all the rest
];

@NgModule({
  // PreloadAllModules Load your main application module first, and in the background load all the other modules
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
    }
  )],

  exports: [RouterModule]
})
export class AppRoutingModule { }
