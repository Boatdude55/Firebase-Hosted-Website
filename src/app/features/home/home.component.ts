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
          "CSC 337:\n\tUse HTML5, CSS, and Javascript/AJAX for event-driven programming on the front-end. Declarative programming with SQL, and PHP\n\tfor server side programming and database access",
          "CS 120 & 121:\n\tC/C++ courses on the principles of Object Oriented Programming, Data Structures, algorithms and design patterns.",
          "CS 150:\n\tComputer architecture class, where the topics included history, transistors/logic gates,  components/instruction cycle, processors\n\tand assembly language."
          ]
      }
    ]),
    new Description([
      {
        title: "Scholarships and various Awards",
        values: [
          "Awards: University of Idaho 3rd place in Martin Luther King Jr. Essay Scholarship Contest.",
          "Achievements and Participation:\n\tOutstanding Participant in National Achievement Program.\n\tNational Merit Scholar Semi Finalist."
          ]
      }
    ]),
    new Description([
      {
        title: "Skills",
        values: [
            "Javascript: Web API’s, Angular(1+), and competent with JQuery",
            "Stacks: XAMPP, LAMPP, and MEAN",
            "Tools: Git, WebPack",
            "Enviroments:\n\tNode.js, Linux terminal, AWS Cloud9 IDE, and competent with Google Cloud Shell.\n\tGoogle Cloud Platform, Google Developers"
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
