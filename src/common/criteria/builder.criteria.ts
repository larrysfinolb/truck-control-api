import { BaseCriteria } from './base.criteria.js';

export class CriteriaBuilder<T> {
  private criteriaList: BaseCriteria<T>[] = [];

  add(criteria: BaseCriteria<T>): this {
    this.criteriaList.push(criteria);
    return this;
  }

  build(): T {
    return this.criteriaList.reduce((acc, criteria) => {
      return { ...acc, ...criteria.apply() };
    }, {} as T);
  }
}
