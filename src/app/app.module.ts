import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './router/router.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './features/navbar/navbar.component';
import { HomeComponent } from './features/home/home.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { ShowcaseComponent } from './features/showcase/showcase.component';

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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
