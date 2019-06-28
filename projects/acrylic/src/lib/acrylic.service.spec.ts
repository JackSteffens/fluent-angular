import { TestBed } from '@angular/core/testing';

import { AcrylicService } from './acrylic.service';

describe('AcrylicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcrylicService = TestBed.get(AcrylicService);
    expect(service).toBeTruthy();
  });
});
