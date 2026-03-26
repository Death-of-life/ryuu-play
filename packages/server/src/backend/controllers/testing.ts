import { Request, Response } from 'express';
import { CardManager, GameSettings, ResolvePromptAction, Rules } from '@ptcg/common';

import { Controller, Post } from './controller';
import { AuthToken, Validate, check } from '../services';
import { ApiErrorEnum } from '@ptcg/common';
import { BotManager } from '../../game/bots/bot-manager';
import { BotClient } from '../../game/bots/bot-client';
import { Deck, User } from '../../storage';

export class Testing extends Controller {

  @Post('/create')
  @AuthToken()
  @Validate({
    playerDeckId: check().isNumber(),
    botDeckId: check().isNumber()
  })
  public async onCreate(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const playerDeckId: number = req.body.playerDeckId;
    const botDeckId: number = req.body.botDeckId;
    const clientId: number | undefined = typeof req.body.clientId === 'number'
      ? req.body.clientId
      : undefined;
    const formatName: string = typeof req.body.formatName === 'string'
      ? req.body.formatName.trim()
      : '';

    const user = await User.findOneById(userId);
    if (user === null) {
      res.status(400);
      res.send({ error: ApiErrorEnum.PROFILE_INVALID });
      return;
    }

    const playerDeck = await Deck.findOne({ where: { id: playerDeckId }, relations: ['user'] });
    const botDeck = await Deck.findOne({ where: { id: botDeckId }, relations: ['user'] });
    if (playerDeck === null || botDeck === null || playerDeck.user.id !== userId || botDeck.user.id !== userId) {
      res.status(400);
      res.send({ error: ApiErrorEnum.DECK_INVALID });
      return;
    }

    const playerCards = JSON.parse(playerDeck.cards) as string[];
    const botCards = JSON.parse(botDeck.cards) as string[];
    if (!this.validateCards(playerCards) || !this.validateCards(botCards)) {
      res.status(400);
      res.send({ error: ApiErrorEnum.DECK_INVALID });
      return;
    }

    const settings = new GameSettings();
    settings.timeLimit = 0;
    settings.recordingEnabled = true;
    settings.rules = this.getRulesForFormat(formatName);

    let bot: BotClient;
    try {
      bot = BotManager.getInstance().getBot('bot');
    } catch (error) {
      res.status(400);
      res.send({ ok: false, error: 'Bot not available.' });
      return;
    }

    const client = clientId !== undefined
      ? this.core.clients.find(c => c.id === clientId && c.user.id === userId)
      : this.core.clients.find(c => c.user.id === userId);
    if (client === undefined) {
      res.status(400);
      res.send({ error: ApiErrorEnum.AUTH_TOKEN_INVALID });
      return;
    }

    const game = this.core.createGame(client, playerCards, settings, bot);
    const invitePrompt = game.state.prompts.find(prompt =>
      prompt.playerId === bot.id && prompt.result === undefined
    );

    if (invitePrompt) {
      game.dispatch(bot, new ResolvePromptAction(invitePrompt.id, botCards));
    }

    res.send({
      ok: true,
      gameId: game.id,
      formatName: settings.rules.formatName,
      botUserId: bot.user.id
    });
  }

  private validateCards(deck: string[]) {
    if (!(deck instanceof Array)) {
      return false;
    }

    const cardManager = CardManager.getInstance();
    return deck.every(card => typeof card === 'string' && cardManager.isCardDefined(card));
  }

  private getRulesForFormat(formatName: string): Rules {
    const format = CardManager.getInstance().getAllFormats().find(item => item.name === formatName);
    return format
      ? new Rules({ ...format.rules, formatName })
      : new Rules({ formatName });
  }
}
