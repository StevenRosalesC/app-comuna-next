export type PersonsListKeyParams = {
  pageSize: number;
  pageIndex: number;
  orderBy: string;
  order: 'asc' | 'desc';
  search: string;
  status?: boolean;
};

export type PersonsPaginatedKeyParams = {
  page: number;
  pageSize: number;
  search: string;
};

export const personsKeys = {
  all: ['persons'] as const,
  lists: () => [...personsKeys.all, 'list'] as const,
  list: (params: PersonsListKeyParams) => [...personsKeys.lists(), params] as const,
  paginated: (params: PersonsPaginatedKeyParams) =>
    [...personsKeys.lists(), 'paginated', params] as const
};

