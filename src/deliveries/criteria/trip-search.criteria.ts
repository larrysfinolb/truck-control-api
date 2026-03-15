import { BaseCriteria } from '../../common/criteria/base.criteria.js';
import { Prisma } from '../../../generated/prisma/client.js';

export class TripSearchCriteria extends BaseCriteria<Prisma.DeliveryWhereInput> {
  constructor(private readonly searchTerm?: string) {
    super();
  }

  apply(): Prisma.DeliveryWhereInput {
    if (!this.searchTerm) {
      return {};
    }

    return {
      OR: [
        { origin: { contains: this.searchTerm, mode: 'insensitive' } },
        { destination: { contains: this.searchTerm, mode: 'insensitive' } },
        {
          vehicle: {
            licensePlate: { contains: this.searchTerm, mode: 'insensitive' },
          },
        },
        {
          vehicle: {
            model: { contains: this.searchTerm, mode: 'insensitive' },
          },
        },

        {
          driver: {
            firstName: { contains: this.searchTerm, mode: 'insensitive' },
          },
        },
        {
          driver: {
            lastName: { contains: this.searchTerm, mode: 'insensitive' },
          },
        },
      ],
    };
  }
}
