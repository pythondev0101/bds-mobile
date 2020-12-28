import { TestBed } from '@angular/core/testing';

import { NetworkListenerService } from './network-listener.service';

describe('NetworkListenerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkListenerService = TestBed.get(NetworkListenerService);
    expect(service).toBeTruthy();
  });
});
