import { create } from 'zustand';

export type FiltersState = {
  filters: {
    site?: number[];
    make?: string[];
    model?: string;
    year_from?: number;
    year_to?: number;
  };
  initialized: boolean; 
  setFilters: (filters: FiltersState['filters']) => void;
  markInitialized: () => void; 
};

export const useFilterStore = create<FiltersState>((set) => ({
  filters: {},
  initialized: false,
  setFilters: (filters) => set({ filters }),
  markInitialized: () => set({ initialized: true }),
}));
