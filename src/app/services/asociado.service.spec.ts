import { TestBed } from '@angular/core/testing';

import { AsociadoService } from './asociado.service';

describe('AsociadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AsociadoService = TestBed.get(AsociadoService);
    expect(service).toBeTruthy();
  });
});
