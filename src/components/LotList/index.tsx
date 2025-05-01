'use client';

import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { PropLot } from '../../domains/lots/types';
import LotCard from '../LotCard';
import { useWindowSize } from '../../hooks';

type LotListProps = {
  lots: PropLot[];
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
};

export default function LotList({ lots, loadMore, hasMore, isLoading }: LotListProps) {
  const { width } = useWindowSize();

  const itemSize = width <= 1680 ? 300 : width < 1920 ? 320 : 260;
  const height = 900;

  const Row = ({ index, style }: ListChildComponentProps) => {
    if (hasMore && index === lots.length) {
      return (
        <div style={style} className="flex justify-center items-center -mt-15">
          <button
            onClick={loadMore}
            className="px-6 py-3 w-[320px] bg-[#0C2340] text-white rounded-lg text-xs font-[350] hover:bg-[#16325c] transition"
            disabled={isLoading}
            aria-label="Load more lots"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      );
    }

    return (
      <div style={style}>
        <LotCard {...lots[index]} />
      </div>
    );
  };

  const itemCount = hasMore ? lots.length + 1 : lots.length;

  return (
    <div className="pl-4">
      <List
        height={height}
        itemCount={itemCount}
        itemSize={itemSize}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
}
