'use client';

import { useLots } from '../domains/lots/hooks';
import LotList from '../components/LotList';
import { CarFilters } from '../components/LotFilters';

export default function Home() {
  const { lots, loadMore, hasMore, isLoading } = useLots();

  return (
    <main className="flex gap-8 px-6">
      <aside className="pt-6">
        <CarFilters />
      </aside>
      <section className="flex-1">
        <h1 className="text-3xl font-bold my-6">Lot Catalog</h1>
        <LotList lots={lots} loadMore={loadMore} hasMore={hasMore} isLoading={isLoading} />
      </section>
    </main>
  );
}
