import { TestBed, inject } from '@angular/core/testing';

import { ProteinDomainService } from './protein-domain.service';

describe('ProteinDomainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProteinDomainService]
    });
  });

  it('should be created', inject([ProteinDomainService], (service: ProteinDomainService) => {
    expect(service).toBeTruthy();
  }));
});
