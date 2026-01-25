export interface PageMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Page<T> {
  data: T[];
  meta: PageMeta;
}
