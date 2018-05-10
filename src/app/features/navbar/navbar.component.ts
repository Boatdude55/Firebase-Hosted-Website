import { Component, OnInit } from '@angular/core';
import {View} from './view';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

    menu = [
    new View('main', 'Home', 'home'),
    new View('main', 'Projects', 'projects'),
    new View('main', 'Showcase', 'showcase')
  ];

  constructor() { }

  ngOnInit() {
  }

}
