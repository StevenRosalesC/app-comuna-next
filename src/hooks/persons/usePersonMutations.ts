import {
  useMutation,
  useQueryClient,
  type UseMutationOptions
} from '@tanstack/react-query';
import type { ServiceResponse } from '@/interfaces/common';
import type { IPerson, Person } from '@/interfaces/persons';
import { personsService } from '@/services/persons';
import { personsKeys } from '@/lib/queryKeys/persons';

export type UpdatePersonVariables = {
  personId: string;
  data: Omit<Person, 'personId'>;
};

export function useCreatePersonMutation<TContext = unknown>(
  options?: UseMutationOptions<
    ServiceResponse<IPerson | null>,
    Error,
    IPerson,
    TContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation<ServiceResponse<IPerson | null>, Error, IPerson, TContext>({
    mutationFn: (person) => personsService.createPerson(person),
    ...options,
    onSuccess: async (data, variables, context, meta) => {
      if (data.status) {
        await queryClient.invalidateQueries({ queryKey: personsKeys.all });
      }
      await (options?.onSuccess as any)?.(data, variables, context, meta);
    }
  });
}

export function useUpdatePersonMutation<TContext = unknown>(
  options?: UseMutationOptions<
    ServiceResponse<Person | null>,
    Error,
    UpdatePersonVariables,
    TContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ServiceResponse<Person | null>,
    Error,
    UpdatePersonVariables,
    TContext
  >({
    mutationFn: ({ personId, data }) => personsService.updatePerson(personId, data),
    ...options,
    onSuccess: async (data, variables, context, meta) => {
      if (data.status) {
        await queryClient.invalidateQueries({ queryKey: personsKeys.all });
      }
      await (options?.onSuccess as any)?.(data, variables, context, meta);
    }
  });
}
