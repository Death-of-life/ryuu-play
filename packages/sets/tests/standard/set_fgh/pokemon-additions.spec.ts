import {
  AttackAction,
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  PlayCardAction,
  PlayerType,
  PutDamageEffect,
  ResolvePromptAction,
  SelectPrompt,
  Simulator,
  SlotType,
  UseAbilityAction,
} from '@ptcg/common';

import { Eviolite } from '../../../src/standard/set-diamond-and-pearl/eviolite';
import { Leon } from '../../../src/standard/set-sword-and-shield/leon';
import { Annihilape } from '../../../src/standard/set_fgh/annihilape';
import { BoBo } from '../../../src/standard/set_fgh/bo-bo';
import { DaBiNiaoEx } from '../../../src/standard/set_fgh/da-bi-niao-ex';
import { DaBiNiaoV } from '../../../src/standard/set_fgh/da-bi-niao-v';
import { DaWeiLi } from '../../../src/standard/set_fgh/da-wei-li';
import { DaYaLi } from '../../../src/standard/set_fgh/da-ya-li';
import { Drifloon } from '../../../src/standard/set_fgh/drifloon';
import { GardevoirEx } from '../../../src/standard/set_fgh/gardevoir-ex';
import { GuangHuiJiaHeRenWa } from '../../../src/standard/set_fgh/guang-hui-jia-he-ren-wa';
import { GuangHuiPenHuoLong } from '../../../src/standard/set_fgh/guang-hui-pen-huo-long';
import { GuiJiaoLuV } from '../../../src/standard/set_fgh/gui-jiao-lu-v';
import { HongMingYueEx } from '../../../src/standard/set_fgh/hong-ming-yue-ex';
import { HouJiaoWei } from '../../../src/standard/set_fgh/hou-jiao-wei';
import { HuoKongLong } from '../../../src/standard/set_fgh/huo-kong-long';
import { Kirlia } from '../../../src/standard/set_fgh/kirlia';
import { setFgh } from '../../../src/standard/set_fgh';
import { LumineonV } from '../../../src/standard/set_fgh/lumineon-v';
import { Manaphy } from '../../../src/standard/set_fgh/manaphy';
import { RadiantAlakazam } from '../../../src/standard/set_fgh/radiant-alakazam';
import { IronHandsEx } from '../../../src/standard/set_fgh/iron-hands-ex';
import { LuoJiYaV } from '../../../src/standard/set_fgh/luo-ji-ya-v';
import { LuoJiYaVSTAR } from '../../../src/standard/set_fgh/luo-ji-ya-vstar';
import { MiraidonEx } from '../../../src/standard/set_fgh/miraidon-ex';
import { NuYingGeEx } from '../../../src/standard/set_fgh/nu-ying-ge-ex';
import { PenHuoLongEx } from '../../../src/standard/set_fgh/pen-huo-long-ex';
import { Ralts } from '../../../src/standard/set_fgh/ralts';
import { RaichuV } from '../../../src/standard/set_fgh/raichu-v';
import { RaikouV } from '../../../src/standard/set_fgh/raikou-v';
import { RotomV } from '../../../src/standard/set_fgh/rotom-v';
import { ShiZuDaNiao } from '../../../src/standard/set_fgh/shi-zu-da-niao';
import { TaoDaiLangEx } from '../../../src/standard/set_fgh/tao-dai-lang-ex';
import { XiaoHuoLong } from '../../../src/standard/set_fgh/xiao-huo-long';
import { YaoQuanEr } from '../../../src/standard/set_fgh/yao-quan-er';
import { YueYueXiongHeYueEx } from '../../../src/standard/set_fgh/yue-yue-xiong-he-yue-ex';
import { ZhenYiFa } from '../../../src/standard/set_fgh/zhen-yi-fa';
import { Zapdos } from '../../../src/standard/set_fgh/zapdos';
import { TestCard } from '../../test-cards/test-card';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('set_fgh pokemon additions', () => {
  it('registers the added Pokemon cards in set_fgh', () => {
    expect(setFgh.some(card => card instanceof GardevoirEx)).toBe(true);
    expect(setFgh.some(card => card instanceof Kirlia)).toBe(true);
    expect(setFgh.some(card => card instanceof Ralts)).toBe(true);
    expect(setFgh.some(card => card instanceof Annihilape)).toBe(true);
    expect(setFgh.some(card => card instanceof BoBo)).toBe(true);
    expect(setFgh.some(card => card instanceof DaBiNiaoEx)).toBe(true);
    expect(setFgh.some(card => card instanceof DaBiNiaoV)).toBe(true);
    expect(setFgh.some(card => card instanceof DaWeiLi)).toBe(true);
    expect(setFgh.some(card => card instanceof DaYaLi)).toBe(true);
    expect(setFgh.some(card => card instanceof Drifloon)).toBe(true);
    expect(setFgh.some(card => card instanceof HouJiaoWei)).toBe(true);
    expect(setFgh.some(card => card instanceof GuangHuiJiaHeRenWa)).toBe(true);
    expect(setFgh.some(card => card instanceof GuangHuiPenHuoLong)).toBe(true);
    expect(setFgh.some(card => card instanceof GuiJiaoLuV)).toBe(true);
    expect(setFgh.some(card => card instanceof HongMingYueEx)).toBe(true);
    expect(setFgh.some(card => card instanceof HuoKongLong)).toBe(true);
    expect(setFgh.some(card => card instanceof IronHandsEx)).toBe(true);
    expect(setFgh.some(card => card instanceof RotomV)).toBe(true);
    expect(setFgh.some(card => card instanceof LumineonV)).toBe(true);
    expect(setFgh.some(card => card instanceof LuoJiYaV)).toBe(true);
    expect(setFgh.some(card => card instanceof LuoJiYaVSTAR)).toBe(true);
    expect(setFgh.some(card => card instanceof MiraidonEx)).toBe(true);
    expect(setFgh.some(card => card instanceof NuYingGeEx)).toBe(true);
    expect(setFgh.some(card => card instanceof PenHuoLongEx)).toBe(true);
    expect(setFgh.some(card => card instanceof YaoQuanEr)).toBe(true);
    expect(setFgh.some(card => card instanceof RaichuV)).toBe(true);
    expect(setFgh.some(card => card instanceof RaikouV)).toBe(true);
    expect(setFgh.some(card => card instanceof ZhenYiFa)).toBe(true);
    expect(setFgh.some(card => card instanceof ShiZuDaNiao)).toBe(true);
    expect(setFgh.some(card => card instanceof XiaoHuoLong)).toBe(true);
    expect(setFgh.some(card => card instanceof YueYueXiongHeYueEx)).toBe(true);
    expect(setFgh.some(card => card instanceof Zapdos)).toBe(true);
    expect(setFgh.some(card => card instanceof Manaphy)).toBe(true);
    expect(setFgh.some(card => card instanceof TaoDaiLangEx)).toBe(true);
    expect(setFgh.some(card => card instanceof RadiantAlakazam)).toBe(true);
  });
});

describe('RotomV set_fgh', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('uses 快速充电', () => {
    const rotomV = new RotomV();
    const topA = new TestCard();
    const topB = new TestCard();
    const topC = new TestCard();

    const { player, state } = TestUtils.getAll(sim);
    player.bench[0].pokemons.cards = [rotomV];
    player.deck.cards = [topA, topB, topC];

    sim.dispatch(new UseAbilityAction(1, '快速充电', {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.BENCH,
      index: 0,
    }));

    expect(player.hand.cards).toEqual([topA, topB, topC]);
    expect(state.activePlayer).toEqual(1);
  });

  it('adds damage with 废品短路 for each tool moved to the Lost Zone', () => {
    const rotomV = new RotomV();
    const toolA = new Eviolite();

    const { player, opponent } = TestUtils.getAll(sim);

    TestUtils.setActive(sim, [rotomV], [CardType.LIGHTNING, CardType.LIGHTNING]);
    player.discard.cards = [toolA];
    sim.dispatch(new AttackAction(1, '废品短路'));

    const prompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    sim.dispatch(new ResolvePromptAction(prompt.id, [toolA]));

    expect(opponent.active.damage).toEqual(80);
    expect(player.lostzone.cards).toContain(toolA);
  });
});

describe('LumineonV set_fgh', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('searches a Supporter with 夜光信号 when played to the Bench', () => {
    const lumineonV = new LumineonV();
    const leon = new Leon();
    const filler = new TestCard();

    const { player } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    player.hand.cards = [lumineonV];
    player.deck.cards = [filler, leon];

    sim.dispatch(new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }));

    const prompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    sim.dispatch(new ResolvePromptAction(prompt.id, [leon]));

    expect(player.bench[0].getPokemonCard()).toBe(lumineonV);
    expect(player.hand.cards).toContain(leon);
  });
});

describe('Manaphy set_fgh', () => {
  it('prevents bench damage from opponent attacks with 浪花水帘', () => {
    const sim = TestUtils.createTestSimulator();
    const manaphy = new Manaphy();
    const attacker = new TestPokemon();

    const { player, opponent, state } = TestUtils.getAll(sim);
    player.bench[0].pokemons.cards = [manaphy];
    player.bench[1].pokemons.cards = [new TestPokemon()];
    opponent.active.pokemons.cards = [attacker];

    const attackEffect = new AttackEffect(opponent, player, attacker.attacks[0]);
    const putDamageEffect = new PutDamageEffect(attackEffect, 30);
    putDamageEffect.target = player.bench[1];

    sim.store.reduceEffect(state, putDamageEffect);

    expect(player.bench[1].damage).toEqual(0);
  });
});

describe('RadiantAlakazam set_fgh', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('moves up to 2 damage counters with 伤痛汤匙', () => {
    const alakazam = new RadiantAlakazam();

    const { player, opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    player.bench[0].pokemons.cards = [alakazam];
    opponent.active.damage = 20;
    opponent.bench[0].pokemons.cards = [new TestPokemon()];

    sim.dispatch(new UseAbilityAction(1, '伤痛汤匙', {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.BENCH,
      index: 0,
    }));

    let prompt = TestUtils.getLastPrompt(sim) as ChoosePokemonPrompt;
    sim.dispatch(new ResolvePromptAction(prompt.id, [opponent.active]));

    prompt = TestUtils.getLastPrompt(sim) as ChoosePokemonPrompt;
    sim.dispatch(new ResolvePromptAction(prompt.id, [opponent.bench[0]]));

    const selectPrompt = TestUtils.getLastPrompt(sim) as SelectPrompt;
    sim.dispatch(new ResolvePromptAction(selectPrompt.id, 1));

    expect(opponent.active.damage).toEqual(0);
    expect(opponent.bench[0].damage).toEqual(20);
  });
});
