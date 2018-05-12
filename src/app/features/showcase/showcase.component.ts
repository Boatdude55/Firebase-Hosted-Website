import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MinesweeperService } from '../../services/minesweeper/minesweeper.service';

@Component({
  templateUrl: './showcase.component.html',
  providers: [MinesweeperService]
})
export class ShowcaseComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef;
  
  constructor( private minesweeperService: MinesweeperService ) {

  }

  ngOnInit() {
    
    this.minesweeperService.setup(this.canvas.nativeElement);

  }

  clickEvent ( $event ) {
    
    this.minesweeperService.onClick( $event );

  }
  
	newGameEvent () {
	  
    this.minesweeperService.clear();
    this.minesweeperService.fillMap();
    this.minesweeperService.drawMap();
    this.minesweeperService.on = true;
  }
  
  changeStyle ( $event ) {
        
    var style = $event.target.dataset.value;
    
    if ( style !== undefined ) {
      
        this.minesweeperService.setStyle(style);
    }
    
    this.newGameEvent();

  }
  
  changeDifficulty ( $event ) {

    var diff = $event.target.dataset.value;
    
    if ( diff !== undefined ) {

        this.minesweeperService.setDifficulty(diff);
  
    }
    
    this.newGameEvent();

  }
}
