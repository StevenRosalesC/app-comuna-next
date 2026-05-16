import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { personsService } from '@/services/persons';
import type { Person } from '@/interfaces/persons';
import {
  personsKeys,
  type PersonsPaginatedKeyParams
} from '@/lib/queryKeys/persons';

type PersonsPaginatedResponse = { data: Person[]; nextPage?: number };

export function usePersonsPaginatedQuery(
  params: PersonsPaginatedKeyParams,
  options?: Omit<
    UseQueryOptions<PersonsPaginatedResponse, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<PersonsPaginatedResponse, Error>({
    queryKey: personsKeys.paginated(params),
    queryFn: () =>
      personsService.getPersonsPaginated({
        pageParam: params.page,
        search: params.search,
        pageSize: params.pageSize
      }),
    ...options
  });
}

