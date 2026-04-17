import { Prisma, TripType } from '../../../generated/prisma/client.js';
import { BaseCriteria } from '../../common/criteria/base.criteria.js';

export class ActiveTripCriteria extends BaseCriteria<Prisma.TripWhereInput> {
  apply(): Prisma.TripWhereInput {
    return { deletedAt: null };
  }
}

export class TripTypeCriteria extends BaseCriteria<Prisma.TripWhereInput> {
  constructor(private readonly type?: TripType) {
    super();
  }

  apply(): Prisma.TripWhereInput {
    if (!this.type) {
      return {};
    }

    return { type: this.type };
  }
}

export class TripOwnerCriteria extends BaseCriteria<Prisma.TripWhereInput> {
  constructor(private readonly userId: string) {
    super();
  }

  apply(): Prisma.TripWhereInput {
    return { userId: this.userId };
  }
}
