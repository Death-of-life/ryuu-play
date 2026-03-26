export class Rules {

  public formatName = '';

  public firstTurnDrawCard = true;

  public firstTurnUseSupporter = true;

  public firstTurnUseAttack = true;
  
  public noPrizeForFossil = true;

  constructor(init: Partial<Rules> = {}) {
    Object.assign(this, init);
  }

}
