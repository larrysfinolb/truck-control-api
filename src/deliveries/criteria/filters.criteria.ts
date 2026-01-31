import { DeliveryType, Prisma } from '../../../generated/prisma/client.js';
import { BaseCriteria } from '../../common/criteria/base.criteria.js';

export class ActiveDeliveryCriteria extends BaseCriteria<Prisma.DeliveryWhereInput> {
  apply(): Prisma.DeliveryWhereInput {
    return { deletedAt: null };
  }
}

export class DeliveryTypeCriteria extends BaseCriteria<Prisma.DeliveryWhereInput> {
  constructor(private readonly type?: DeliveryType) {
    super();
  }

  apply(): Prisma.DeliveryWhereInput {
    if (!this.type) {
      return {};
    }

    return { type: this.type };
  }
}

export class DeliveryOwnerCriteria extends BaseCriteria<Prisma.DeliveryWhereInput> {
  constructor(private readonly userId: string) {
    super();
  }

  apply(): Prisma.DeliveryWhereInput {
    return { userId: this.userId };
  }
}
