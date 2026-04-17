import { Prisma } from '../../../generated/prisma/client.js';
import { BaseCriteria } from '../../common/criteria/base.criteria.js';

export class TripSearchCriteria extends BaseCriteria<Prisma.TripWhereInput> {
  constructor(private readonly searchTerm?: string) {
    super();
  }

  apply(): Prisma.TripWhereInput {
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
