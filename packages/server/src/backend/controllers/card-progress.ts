import { Application, Request, Response } from 'express';

import { Controller, Get, Post } from './controller';
import { PokemonProgressRecord, PokemonProgressTracker } from '../services/pokemon-progress-tracker';
import { Storage } from '../../storage';
import { Core } from '../../game/core/core';

export class CardProgress extends Controller {

  constructor(
    path: string,
    app: Application,
    db: Storage,
    core: Core,
    private readonly tracker = new PokemonProgressTracker()
  ) {
    super(path, app, db, core);
  }

  @Get('/pokemon/summary')
  public async onPokemonSummary(req: Request, res: Response) {
    res.send({
      ok: true,
      summary: this.tracker.getSummary()
    });
  }

  @Get('/pokemon/list')
  public async onPokemonList(req: Request, res: Response) {
    const limit = req.query.limit == null ? undefined : parseInt(String(req.query.limit), 10);
    const offset = req.query.offset == null ? undefined : parseInt(String(req.query.offset), 10);
    const result = this.tracker.list({
      phaseMark: this.readQuery(req.query.phaseMark),
      implementationStatus: this.readQuery(req.query.implementationStatus),
      backendStatus: this.readQuery(req.query.backendStatus),
      uiStatus: this.readQuery(req.query.uiStatus),
      aiApiStatus: this.readQuery(req.query.aiApiStatus),
      implementedInRepo: this.readQuery(req.query.implementedInRepo),
      specialRule: this.readQuery(req.query.specialRule),
      search: this.readQuery(req.query.search),
      limit: Number.isFinite(limit) ? limit : undefined,
      offset: Number.isFinite(offset) ? offset : undefined
    });

    res.send({
      ok: true,
      csvPath: this.tracker.getCsvPath(),
      total: result.total,
      items: result.items
    });
  }

  @Get('/pokemon/next')
  public async onPokemonNext(req: Request, res: Response) {
    const item = this.tracker.getNext({
      phaseMark: this.readQuery(req.query.phaseMark),
      implementationStatus: this.readQuery(req.query.implementationStatus),
      specialRule: this.readQuery(req.query.specialRule),
      search: this.readQuery(req.query.search)
    });

    res.send({
      ok: true,
      csvPath: this.tracker.getCsvPath(),
      item: item || null
    });
  }

  @Post('/pokemon/update')
  public async onPokemonUpdate(req: Request, res: Response) {
    const trackingKey = this.readNonEmptyBody(req.body.trackingKey);
    const yorenCode = this.readNonEmptyBody(req.body.yorenCode);

    if (!trackingKey && !yorenCode) {
      res.status(400).send({
        ok: false,
        error: 'Missing trackingKey or yorenCode.'
      });
      return;
    }

    const patch: Partial<PokemonProgressRecord> = {
      implementation_status: this.readPatchValue(req.body, 'implementationStatus'),
      backend_status: this.readPatchValue(req.body, 'backendStatus'),
      ui_status: this.readPatchValue(req.body, 'uiStatus'),
      ai_api_status: this.readPatchValue(req.body, 'aiApiStatus'),
      implemented_file: this.readPatchValue(req.body, 'implementedFile'),
      test_file: this.readPatchValue(req.body, 'testFile'),
      notes: this.readPatchValue(req.body, 'notes')
    };

    try {
      const item = this.tracker.update({ trackingKey, yorenCode }, patch);
      res.send({
        ok: true,
        csvPath: this.tracker.getCsvPath(),
        item
      });
    } catch (error) {
      res.status(404).send({
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error.'
      });
    }
  }

  @Post('/pokemon/regenerate')
  public async onPokemonRegenerate(req: Request, res: Response) {
    const result = this.tracker.regenerate();

    res.send({
      ok: true,
      csvPath: this.tracker.getCsvPath(),
      result
    });
  }

  private readQuery(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
  }

  private readNonEmptyBody(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
  }

  private readPatchValue(body: Request['body'], key: string): string | undefined {
    if (body == null || typeof body !== 'object' || !Object.prototype.hasOwnProperty.call(body, key)) {
      return undefined;
    }

    const value = (body as { [key: string]: unknown })[key];
    return typeof value === 'string' ? value.trim() : undefined;
  }

}
