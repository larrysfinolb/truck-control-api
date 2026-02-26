import { Prisma } from '../../../generated/prisma/client.js';
import { BaseCriteria } from '../../common/criteria/base.criteria.js';

export class ActiveDriverCriteria extends BaseCriteria<Prisma.DriverWhereInput> {
  apply(): Prisma.DriverWhereInput {
    return { deletedAt: null };
  }
}

export class DriverOwnerCriteria extends BaseCriteria<Prisma.DriverWhereInput> {
  constructor(private readonly userId: string) {
    super();
  }

  apply(): Prisma.DriverWhereInput {
    return { userId: this.userId };
  }
}
