import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { personsService } from '@/services/persons';
import type { ServiceResponse } from '@/interfaces/common';
import type { IPersonsRequestResponse } from '@/interfaces/persons';
import {
  personsKeys,
  type PersonsListKeyParams
} from '@/lib/queryKeys/persons';

export function usePersonsListQuery(
  params: PersonsListKeyParams,
  options?: Omit<
    UseQueryOptions<ServiceResponse<IPersonsRequestResponse | null>, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<ServiceResponse<IPersonsRequestResponse | null>, Error>({
    queryKey: personsKeys.list(params),
    queryFn: () =>
      personsService.getPersons(
        params.pageSize,
        params.pageIndex * params.pageSize,
        params.orderBy,
        params.order,
        params.search,
        params.status
      ),
    ...options
  });
}

