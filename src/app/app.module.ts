import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './router/router.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavbarComponent } from './features/navbar/navbar.component';
import { HomeComponent } from './features/home/home.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { ShowcaseComponent } from './features/showcase/showcase.component';

import { MapService } from "./services/map/map.service";
import { GridService } from "./services/grid/grid.service";
import { LoaderService } from "./services/loader/loader.service";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProjectsComponent,
    ShowcaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
      MapService,
      GridService,
      LoaderService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
