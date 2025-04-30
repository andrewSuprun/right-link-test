import { create } from 'zustand';
import { FilterParams } from './types';

type FilterState = {
  filters: FilterParams;
  setFilters: (filters: FilterParams) => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
}));
