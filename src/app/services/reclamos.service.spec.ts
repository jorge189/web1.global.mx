import { TestBed } from '@angular/core/testing';

import { ReclamosService } from './reclamos.service';

describe('ReclamosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReclamosService = TestBed.get(ReclamosService);
    expect(service).toBeTruthy();
  });
});
