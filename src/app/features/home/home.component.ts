import { Component, OnInit } from '@angular/core';
import { Detail, Description } from './detail';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  descriptions = [
    new Description([
      {
        title: "University of Arizona Tucson, Arizona	Graduation: Spring, 2019",
        values: [
          "Major: Information Science and Technology B.S., GPA 3.0",
          "Minor: Mathematic"
          ]
      },
      {
        title: "Courses",
        values: [
          "CS 120 & 121: C/C++ courses on the principles of Object Oriented Programming, Data Structures, algorithms and design patterns.",
          "CS 150: Computer architecture class, where the topics included history, transistors/logic gates,  components/instruction cycle, processors and assembly language."
          ]
      }
    ]),
    new Description([
      {
        title: "Scholarships and various Awards",
        values: [
          "Awards",
          "Achievements and Participation"
          ]
      }
    ]),
    new Description([
      {
        title: "Skills",
        values: [
          "Tools/Platforms: Cloud9, Google Cloud Platform, Git",
          "Langueges: NodeJS, Angular, HTML, CSS, Javascript, PHP, SQL, Regex",
          "Developement: Front-End and Proficient with Full-Stack( XAMPP and MEAN )"
          ]
      }
    ])
  ];

  details = [
    new Detail('Education', 'on', this.descriptions[0]),
    new Detail('Achievements', '', this.descriptions[1]),
    new Detail('Skills', '', this.descriptions[2])
  ];
  
  currDetail = {};
  
  constructor() {
    
    this.currDetail = this.details[0];
    
  }

  ngOnInit() { }

  changeDetail ( detail ) {
    
    for ( var i = 0; i < this.details.length; i++ ) {
      
      if ( this.details[i] === detail ) {
        detail.state = "on";
      }else {
        this.details[i].state = "";
      }
    }
    console.log(detail);
    this.currDetail = detail;
  }
  
}
