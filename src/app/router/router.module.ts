import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../features/home/home.component';
import { ProjectsComponent } from '../features/projects/projects.component';
import { ShowcaseComponent } from '../features/showcase/showcase.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'projects', component: ProjectsComponent },
  { path: 'showcase', component: ShowcaseComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
    appRoutes,
      { enableTracing: true }// remove when building
    )
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }