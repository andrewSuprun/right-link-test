"use client"
import LotList from '../components/LotList';
import { useLots } from '../domains/lots/hooks';

export default function Home() {
  const { lots, loadMore, hasMore, isLoading } = useLots();

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-3xl font-bold my-6">Lot Catalog</h1>
      <LotList lots={lots} loadMore={loadMore} hasMore={hasMore} isLoading={isLoading} />
    </main>
  );
}
