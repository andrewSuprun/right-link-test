'use client';

import { useInView } from 'react-intersection-observer';
import { PropLot } from '../../domains/lots/types';
import LotCard from '../LotCard';


type LotListProps = {
  lots: PropLot[];
};

export default function LotList({ lots, loadMore, hasMore, isLoading }: LotListProps) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  // Optionally auto-load when user scrolls to button
  // Disable auto-trigger if you want button-only logic
  // useEffect(() => {
  //   if (inView && hasMore) loadMore();
  // }, [inView, hasMore, loadMore]);

  return (
    <div className="flex flex-col gap-4 px-4">
      {lots.map((lot) => (
        <LotCard key={lot.id} {...lot} />
      ))}

      {hasMore && (
        <div ref={ref} className="flex justify-center py-6">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-[#0C2340] text-white rounded-lg text-lg font-medium hover:bg-[#16325c] transition"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
