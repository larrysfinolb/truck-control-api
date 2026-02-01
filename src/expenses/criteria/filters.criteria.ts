import { Prisma } from '../../../generated/prisma/client.js';
import { BaseCriteria } from '../../common/criteria/base.criteria.js';

export class ActiveExpenseCriteria extends BaseCriteria<Prisma.ExpenseWhereInput> {
  apply(): Prisma.ExpenseWhereInput {
    return { deletedAt: null };
  }
}

export class ExpenseOwnerCriteria extends BaseCriteria<Prisma.ExpenseWhereInput> {
  constructor(private readonly userId: string) {
    super();
  }

  apply(): Prisma.ExpenseWhereInput {
    return { userId: this.userId };
  }
}
