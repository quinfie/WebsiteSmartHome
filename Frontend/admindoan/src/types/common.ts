// src/types/common.ts

export interface PagedResult<T> {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }
  