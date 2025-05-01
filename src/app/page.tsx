'use client';

import { useLots } from '../domains/lots/hooks';
import LotList from '../components/LotList';
import { CarFilters } from '../components/LotFilters';
import { useFilterStore } from '../domains/lots/store';

export default function Home() {
  const { lots, loadMore, hasMore, isLoading, total } = useLots();
  const { filters } = useFilterStore();

  const selectedMakeLabel = filters.make?.length === 1 ? filters.make[0] : '';

  return (
    <main className="px-4 ">
      {/* Title above everything */}
      <h1 className="text-[24px] font-[400] p-6 -ml-4">
        {total} Search Result{total !== 1 && 's'}
        {selectedMakeLabel && `: ${selectedMakeLabel}`}
      </h1>

      {/* Grid layout: filters on the left, lot list on the right */}
      <div className="flex gap-1">
        <aside className="w-[302px] shrink-0">
          <CarFilters />
        </aside>

        <section className="flex-1">
          <LotList lots={lots} loadMore={loadMore} hasMore={hasMore} isLoading={isLoading} />
        </section>
      </div>
    </main>
  );
}
