import { Response } from './response.interface';

export interface TestingCreateResponse extends Response {
  gameId: number;
  formatName: string;
  botUserId: number;
}
