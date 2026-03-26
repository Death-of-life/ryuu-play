import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { TestingCreateResponse } from '../interfaces/testing.interface';

@Injectable()
export class TestingService {

  constructor(
    private api: ApiService,
  ) {}

  public createGame(playerDeckId: number, botDeckId: number, formatName: string, clientId?: number) {
    return this.api.post<TestingCreateResponse>('/v1/testing/create', {
      playerDeckId,
      botDeckId,
      formatName,
      clientId
    });
  }
}
