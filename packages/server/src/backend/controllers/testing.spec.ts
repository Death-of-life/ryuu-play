import { Application, Request, Response } from 'express';
import { CardManager, ResolvePromptAction } from '@ptcg/common';

import { Testing } from './testing';
import { BotManager } from '../../game/bots/bot-manager';
import { Core } from '../../game/core/core';
import { Storage, Deck, User } from '../../storage';
import { generateToken } from '../services/auth-token';

describe('Testing', () => {
  let controller: Testing;
  let req: Request;
  let res: jasmine.SpyObj<Response>;
  let app: jasmine.SpyObj<Application>;
  let db: jasmine.SpyObj<Storage>;
  let core: Core;

  beforeEach(() => {
    req = {
      body: { playerDeckId: 10, botDeckId: 11, formatName: 'Standard' },
      header: jasmine.createSpy('header').and.returnValue(generateToken(1)),
      ip: '127.0.0.1'
    } as any as Request;
    res = jasmine.createSpyObj('Response', ['send', 'status']);
    res.status.and.returnValue(res);
    app = jasmine.createSpyObj('Application', ['get', 'post']);
    db = jasmine.createSpyObj('Storage', ['connect']);
    core = {
      clients: [],
      createGame: jasmine.createSpy('createGame')
    } as any as Core;
    controller = new Testing('/v1/testing', app, db, core);

    spyOn(User, 'findOneById').and.resolveTo({ id: 1 } as User);
    spyOn(Deck, 'findOne').and.callFake(async (options: any) => {
      const id = options.where.id;
      return {
        id,
        user: { id: 1 },
        cards: JSON.stringify(['Card A'])
      } as any;
    });
    spyOn(CardManager, 'getInstance').and.returnValue({
      isCardDefined: () => true,
      getAllFormats: () => []
    } as any);
  });

  it('creates a testing game and auto-resolves the bot invite', async () => {
    const bot = {
      id: 9,
      user: { id: 99 }
    } as any;
    spyOn(BotManager, 'getInstance').and.returnValue({
      getBot: () => bot
    } as any);
    (core.clients as any) = [{ user: { id: 1 } }];

    const dispatch = jasmine.createSpy('dispatch');
    (core.createGame as jasmine.Spy).and.returnValue({
      id: 123,
      state: {
        prompts: [{ id: 77, playerId: 9, result: undefined }]
      },
      dispatch
    } as any);

    await controller.onCreate(req, res);

    expect(core.createGame as jasmine.Spy).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
    const action = dispatch.calls.mostRecent().args[1] as ResolvePromptAction;
    expect(action).toEqual(jasmine.any(ResolvePromptAction));
    expect(res.send).toHaveBeenCalledWith(jasmine.objectContaining({
      ok: true,
      gameId: 123,
      botUserId: 99
    }));
  });
});
