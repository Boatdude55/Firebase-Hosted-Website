import { TestBed, inject } from '@angular/core/testing';

import { MinesweeperService } from './minesweeper.service';

describe('MinesweeperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MinesweeperService]
    });
  });

  it('should be created', inject([MinesweeperService], (service: MinesweeperService) => {
    expect(service).toBeTruthy();
  }));
});
