import { TestBed } from '@angular/core/testing';

import { RevealService } from './reveal.service';

describe('RevealService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RevealService = TestBed.get(RevealService);
    expect(service).toBeTruthy();
  });
});
