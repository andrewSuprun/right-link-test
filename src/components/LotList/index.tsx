'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useWindowSize } from '../../hooks';
import LotCard from '../LotCard';
import { PropLot } from '../../domains/lots/types';

type LotListProps = {
  lots: PropLot[];
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
};

export default function LotList({ lots, loadMore, hasMore, isLoading }: LotListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  const baseItemHeight =
    width <= 1440 ? 440 : width <= 1680 ? 400 : width < 1920 ? 360 : 320;

  const rowVirtualizer = useVirtualizer({
    count: hasMore ? lots.length + 1 : lots.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = lots[index];
      if (!item) return 100;

      const titleLength = item.title?.length || 0;
      const vinLength = item.vin?.length || 0;
      const hasBuyNow = !!item.priceNew && item.currentBid && item.currentBid < item.priceNew;

      let height = baseItemHeight;
      if (titleLength > 50) height += 20;
      if (titleLength > 100) height += 20;
      if (vinLength > 20) height += 15;
      if (hasBuyNow) height += 40;

      return height;
    },
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '900px', overflow: 'auto' }} className="pl-4">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoader = hasMore && virtualRow.index === lots.length;

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className='pb-4'
            >
              {isLoader ? (
                <div className="flex justify-center items-center -mt-6">
                  <button
                    onClick={loadMore}
                    className="px-6 py-3 w-[320px] bg-[#0C2340] text-white rounded-lg text-xs font-[350] hover:bg-[#16325c] transition"
                    disabled={isLoading}
                    aria-label="Load more lots"
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              ) : (
                <LotCard {...lots[virtualRow.index]} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
