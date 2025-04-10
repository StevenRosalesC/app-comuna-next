import { createStore } from "zustand/vanilla";
import { personsService } from "@/services/persons";
import { Person } from "@/interfaces/persons";

export interface PersonsState {
  persons: Person[];
  isLoading: boolean;
  error: string | null;
  count: number;
  currentPage: number;
  pageSize: number;
  orderBy: string;
  order: string;
  search: string;
  fetchPersons: (pageSize: number, pageIndex: number, orderBy: string, order: string, search: string) => Promise<void>;
  getPersons: (pageSize: number, pageIndex: number, orderBy: string, order: string, search: string) => Person[];
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setOrder: (order: string) => void;
  setOrderBy: (orderBy: string) => void;
  setSearch: (search: string) => void;
}

export const defaultPersonsState = (): PersonsState => ({
  persons: [],
  isLoading: true,
  error: null,
  count: 0,
  currentPage: 0,
  pageSize: 10,
  orderBy: 'id',
  order: 'asc',
  search: '',
  fetchPersons: async () => {},
  getPersons: () => [],
  setCurrentPage: () => {},
  setPageSize: () => {},
  setOrder: () => {},
  setOrderBy: () => {},
  setSearch: () => {},
})

export const createPersonsStore = (initState?: Partial<PersonsState>) =>
  createStore<PersonsState>((set, get) => ({
    ...defaultPersonsState(),
    fetchPersons: async (pageSize: number, pageIndex: number, orderBy: string, order: string, search: string) => {
      try {
        set({ isLoading: true, error: null });
        
        const { data, status } = await personsService.getPersons(
          pageSize,
          pageIndex * pageSize,
          orderBy,
          order,
          search
        );

        if (status) {
          set({ 
            persons: data?.data || [], 
            isLoading: false, 
            count: data?.count || 0,
            currentPage: pageIndex,
            pageSize,
            orderBy,
            order,
            search
          });
        } else {
          set({ 
            error: 'Error al cargar los datos', 
            isLoading: false 
          });
        }
      } catch (error) {
        console.error(error);
        set({ 
          error: 'Error al cargar los datos', 
          isLoading: false 
        });
      }
    },
    getPersons: (pageSize: number, pageIndex: number, orderBy: string, order: string, search: string) => {
      const state = get();
      
      // Only fetch if the parameters have changed or there are no persons
      if (
        state.persons.length === 0 ||
        state.pageSize !== pageSize ||
        state.currentPage !== pageIndex ||
        state.orderBy !== orderBy ||
        state.order !== order ||
        state.search !== search
      ) {
        state.fetchPersons(pageSize, pageIndex, orderBy, order, search);
      }
      
      return state.persons;
    },
    setCurrentPage: (page: number) => {
      const state = get();
      state.fetchPersons(state.pageSize, page, state.orderBy, state.order, state.search);
    },
    setPageSize: (size: number) => {
      const state = get();
      state.fetchPersons(size, 0, state.orderBy, state.order, state.search);
    },
    setOrder: (order: string) => {
      const state = get();
      state.fetchPersons(state.pageSize, state.currentPage, state.orderBy, order, state.search);
    },
    setOrderBy: (orderBy: string) => {
      const state = get();
      state.fetchPersons(state.pageSize, state.currentPage, orderBy, state.order, state.search);
    },
    setSearch: (search: string) => {
      const state = get();
      state.fetchPersons(state.pageSize, 0, state.orderBy, state.order, search);
    },
    ...initState,
  }))


