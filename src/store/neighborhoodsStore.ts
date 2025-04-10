// stores/neighborhoods-store.ts
import { createStore } from "zustand/vanilla";
import apiCommunity from "@/utils/communityApi";

export interface Neighborhood {
  neighborhoodId: string;
  neighborhoodName: string;
}

export type NeighborhoodsState = {
  neighborhoods: Neighborhood[];
  isLoading: boolean;
  setNeighborhoods: (neighborhoods: Neighborhood[]) => void;
  fetchNeighborhoods: () => Promise<void>;
  getNeighborhoods: () => Neighborhood[];
}

export const defaultNeighborhoodsState=(): NeighborhoodsState => ({
  neighborhoods: [],
  isLoading: true,
  setNeighborhoods: () => {},
  fetchNeighborhoods: async () => {},
  getNeighborhoods: () => [],
})


export const createNeighborhoodsStore = (initState?: Partial<NeighborhoodsState>) =>
  createStore<NeighborhoodsState>((set,get) => ({
    neighborhoods: [],
    isLoading: true,
    setNeighborhoods: (neighborhoods: Neighborhood[]) => set({ neighborhoods }),
    fetchNeighborhoods: async () => {
      console.log('fetching neighborhoods');
      try {
        if (get().neighborhoods.length > 0) {
          return;
        }
        const response = await apiCommunity.get("/neighborhoods");
        set({ neighborhoods: response.data.neighborhoods, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
      } finally {
        set({ isLoading: false });
      }
    },
    getNeighborhoods: () => {
      if (get().neighborhoods.length === 0) {
        get().fetchNeighborhoods();
      }
      return get().neighborhoods;
    },
    ...initState,
  }));
