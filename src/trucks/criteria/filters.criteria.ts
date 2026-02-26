import { Prisma } from '../../../generated/prisma/client.js';
import { BaseCriteria } from '../../common/criteria/base.criteria.js';

export class ActiveTruckCriteria extends BaseCriteria<Prisma.TruckWhereInput> {
  apply(): Prisma.TruckWhereInput {
    return { deletedAt: null };
  }
}

export class TruckOwnerCriteria extends BaseCriteria<Prisma.TruckWhereInput> {
  constructor(private readonly userId: string) {
    super();
  }

  apply(): Prisma.TruckWhereInput {
    return { userId: this.userId };
  }
}
