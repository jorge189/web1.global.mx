import { TestBed } from '@angular/core/testing';

import { GlobalpaqService } from './globalpaq.service';

describe('GlobalpaqService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalpaqService = TestBed.get(GlobalpaqService);
    expect(service).toBeTruthy();
  });
});
