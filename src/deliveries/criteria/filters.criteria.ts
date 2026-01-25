import { DeliveryType, Prisma } from '../../../generated/prisma/client.js';
import { BaseCriteria } from '../../common/criteria/base.criteria.js';

export class ActiveDeliveryCriteria extends BaseCriteria<Prisma.DeliveriesWhereInput> {
  apply(): Prisma.DeliveriesWhereInput {
    return { deletedAt: null };
  }
}

export class DeliveryTypeCriteria extends BaseCriteria<Prisma.DeliveriesWhereInput> {
  constructor(private readonly type?: DeliveryType) {
    super();
  }

  apply(): Prisma.DeliveriesWhereInput {
    if (!this.type) {
      return {};
    }

    return { type: this.type };
  }
}
