'use client';

import Image from 'next/image';
import { capitalizeWords, cn } from '../../lib/utils';
import { PropLot } from '../../domains/lots/types';
import { useCurrentBidWhenVisible } from '../../domains/lots/hooks';
import { useInView } from 'react-intersection-observer';


// Reusable badge styles
const greenIcon = 'bg-green-100 border font-[350] border-green-200 text-green-700';
const redIcon = 'bg-red-100 text-red-700 font-[350] border border-[#EC2A31]';

// ✅ Reusable subcomponents

const Badge = ({
  label,
  isPositive,
}: {
  label: string;
  isPositive: boolean;
}) => (
  <span
    className={cn(
      'px-2 py-0.5 rounded text-xs font-medium',
      isPositive ? greenIcon : redIcon
    )}
  >
    {label}
  </span>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="p-6 text-sm flex flex-col">
    <span className="text-gray-400 font-light">{label}:</span>
    <span className="font-[350]">{value ?? '-'}</span>
  </div>
);


const BidBox = ({
  currentBid,
  priceNew,
}: {
  currentBid?: number | null;
  priceNew?: number | null;
}) => (
  <div className="mt-4 space-y-2 text-right">
    <div className="border rounded px-2 py-1 text-sm text-gray-800 bg-gray-100">
      Current Bid: ${currentBid || 0}
    </div>
    {priceNew && (
      <div className="border rounded px-2 py-1 text-xs font-[350] text-red-600 border-red-300 bg-red-50">
        Buy Now: ${priceNew}
      </div>
    )}
  </div>
);

// ✅ Main component

export default function LotCard(props: PropLot) {
  const {
    title,
    imageUrl,
    priceNew,
    location,
    odometer,
    status,
    keyStatus,
    dateEnd,
    lotId,
    vin,
    damage,
    sellerType,
    site,
  } = props;
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 , delay: 500 });

  const { currentBid } = useCurrentBidWhenVisible(
    lotId,
    site,
    inView
  );


  return (
    <div ref={ref} className="flex bg-white rounded-lg shadow-sm overflow-hidden border border-[#E6E9EC] text-sm min-h-[180px] max-h-60">
      {/* Left: Image */}
      <div className="w-85 h-60 relative overflow-hidden rounded-l-lg">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>

      {/* Center */}
      <div className="flex flex-col flex-1 border-r border-[#E6E9EC]">
        {/* Title */}
        <div className="pt-6 px-6 pb-3 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <h2 className="text-xl ">{title}</h2>
            {/* Optional auction logo */}
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-4 gap-x-4   text-sm">
          <InfoRow
            label="Status"
            value={<Badge label={status || '-'} isPositive={status === 'Run & Drive'} />}
          />
          <InfoRow label="Lot ID" value={lotId} />
          <InfoRow label="Damage" value={damage} />
          <InfoRow
            label="Dealer type"
            value={<Badge label={capitalizeWords(sellerType || '-')} isPositive={sellerType === 'insurance'} />}
          />
          <div className="-mt-2 col-span-1">
          <InfoRow
            label="Key"
            value={<Badge label={keyStatus || '-'} isPositive={keyStatus === 'Yes'} />}
          />
          </div>
          <div className="-mt-2 col-span-1">
          <InfoRow label="VIN Code" value={vin} />
          </div>
          <div className="-mt-2 col-span-1">
          <InfoRow
            label="Odometer"
            value={
              <div className='d-flex flex gap-1'>
                <div className='mr-1'>{odometer || '-'}{' '} miles</div>
                <Badge label="Actual" isPositive={!!odometer} />
              </div>
            }
          />
          </div>
          <div className="-mt-2 col-span-1">
          <InfoRow label="Location" value={capitalizeWords(location ?? '')} />
          </div>
        </div>
      </div>

      {/* Right: Bid + Time */}
      <div className="flex flex-col justify-between p-4 border-l border-[#E6E9EC] w-52">
        <div className="text-small-300 text-gray-500">
          <div>
            📅{' '}
            {new Date(dateEnd || '').toLocaleString('en-GB', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </div>
          <div className="text-green-600 mt-1">⏱ 0 d 0 h 42 min left</div>
        </div>

        <BidBox currentBid={currentBid} priceNew={priceNew} />

        <button className="mt-4 bg-[#FFB839] hover:bg-yellow-300 text-xs border border-[#BF8A2B] font-[350] text-black py-2 rounded w-full">
          Bid Now
        </button>
      </div>
    </div>
  );
}
