'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { formatDistanceStrict } from 'date-fns';
import { capitalizeWords, cn } from '../../lib/utils';
import { PropLot } from '../../domains/lots/types';
import { useCurrentBidWhenVisible } from '../../domains/lots/hooks';
import { useIsSafari } from '../../hooks';

const greenIcon =
  'bg-green-100 border font-[350] border-green-200 text-green-700';
const redIcon = 'bg-red-100 text-red-700 font-[350] border border-[#EC2A31]';

const Badge = ({
  label,
  isPositive,
}: {
  label: string;
  isPositive: boolean;
}) => (
  <span
    className={cn(
      'px-2 py-0.5 max-h-5 rounded text-[14px] font-medium text-nowrap',
      isPositive ? greenIcon : redIcon
    )}
  >
    {label.trim()}
  </span>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="p-5 text-sm flex flex-col">
    <span className="text-gray-400 font-light text-[14px]">{label}:</span>
    <span className="font-[350] break-all text-[14px]">{value ?? '-'}</span>
  </div>
);

const BidBox = ({
  currentBid,
  priceNew,
}: {
  currentBid?: number | null;
  priceNew?: number | null;
}) => (
  <div className={`mt-4 ${priceNew ? 'flex gap-2' : ''} max-w-[272px]`}>
    <div
      className={`border border-[#C0C9D0] rounded px-4 py-2 text-[14px] font-[350] text-gray-800 bg-[#F2F4F6] ${
        priceNew ? 'w-1/2' : 'max-w-[272px]'
      }`}
    >
      <div className="text-gray-500">Current Bid:</div>
      <div>${currentBid || 0}</div>
    </div>

    {priceNew && (
      <div className="w-1/2 border rounded px-4 py-2 text-[14px] font-[350] text-red-600 border-red-300 bg-red-50">
        <div className="text-red-400">Buy Now:</div>
        <div>${priceNew}</div>
      </div>
    )}
  </div>
);

export const LotImage = ({ src, alt }: { src: string; alt: string }) => {
  const isSafari = useIsSafari();
  const [hasError, setHasError] = useState(false);

  return (
    <div className="min-w-85 min-h-60 relative overflow-hidden rounded-l-lg bg-gray-200">
      {!hasError ? (
        isSafari ? (
          <Image
            src={src}
            alt={alt}
            width={340}
            height={240}
            className="object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            onError={() => setHasError(true)}
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-[14px] text-gray-500">
          Image not available
        </div>
      )}
    </div>
  );
};


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
    odobrand,
  } = props;

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0,
    delay: 500,
  });
  const { currentBid } = useCurrentBidWhenVisible(lotId, site, inView);

  const siteLogo = useMemo(() => {
    if (site === 1 || site === 3) return { src: '/copart.svg', alt: 'Copart' };
    if (site === 2 || site === 4) return { src: '/IAA.svg', alt: 'IAAI' };
    return null;
  }, [site]);

  const auctionDate = useMemo(() => {
    if (!dateEnd) return '-';
    const date = new Date(dateEnd);

    const localDate = date.toLocaleDateString(undefined, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });

    const localTime = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const timezoneOffsetMin = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffsetMin) / 60);
    const offsetSign = timezoneOffsetMin > 0 ? '-' : '+';

    const gmtString = `GMT${offsetSign}${offsetHours}`;

    return `${localDate}, ${localTime} ${gmtString}`;
  }, [dateEnd]);

  const timeLeft = useMemo(() => {
    if (!dateEnd) return null;

    const now = new Date();
    const end = new Date(dateEnd);

    if (end <= now) return 'Ended';

    return `${formatDistanceStrict(now, end, {
      unit: 'minute',
      roundingMethod: 'floor',
    })} left`;
  }, [dateEnd]);

  return (
    <div
      ref={ref}
      className="flex bg-white rounded-lg shadow-sm overflow-hidden border border-[#E6E9EC] text-sm min-h-[180px]"
      role="article"
      aria-label={`Lot card for ${title}`}
    >
      {/* Left: Image */}
      {/* <div className="min-w-85 min-h-60 relative overflow-hidden rounded-l-lg">
        <Image
          src={imageUrl}
          alt={title || 'Lot image'}
          fill
          className="object-cover"
        />
      </div> */}
      <LotImage src={imageUrl} alt={title || 'Lot image'}/>

      {/* Center */}
      <div className="flex flex-col flex-1">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <h2
              className="text-xl font-[400] flex items-center gap-2"
              aria-label={`Title: ${title}`}
            >
              {title}
              {siteLogo && (
                <Image
                  width={34}
                  height={20}
                  src={siteLogo.src}
                  alt={siteLogo.alt}
                  className="h-5"
                />
              )}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-3 custom-grid-cols-4  text-sm">
          <InfoRow
            label="Status"
            value={
              <Badge
                label={status || '-'}
                isPositive={status === 'Run & Drive'}
              />
            }
          />
          <InfoRow label="Lot ID" value={lotId} />
          <InfoRow label="Damage" value={damage} />
          <InfoRow
            label="Dealer type"
            value={
              <Badge
                label={capitalizeWords(sellerType || '-')}
                isPositive={sellerType === 'insurance'}
              />
            }
          />
          <div className="-mt-4 col-span-1">
            <InfoRow
              label="Key"
              value={
                <Badge
                  label={keyStatus || '-'}
                  isPositive={keyStatus === 'Yes'}
                />
              }
            />
          </div>
          <div className="-mt-4 col-span-1">
            <InfoRow label="VIN Code" value={vin} />
          </div>
          <div className="-mt-4 col-span-1">
            <InfoRow
              label="Odometer"
              value={
                <div className="flex gap-1">
                  <div className="mr-1 text-nowrap">
                    {odometer || '-'} miles
                  </div>
                  <Badge
                    label={odobrand || ''}
                    isPositive={odobrand === 'Actual'}
                  />
                </div>
              }
            />
          </div>
          <div className="-mt-4 col-span-1">
            <InfoRow label="Location" value={capitalizeWords(location ?? '')} />
          </div>
        </div>
      </div>

      {/* Right: Bid + Time */}
      <div className="flex flex-col justify-between p-4 border-l mt-2 border-[#E6E9EC] w-80">
        <div
          className="text-sm text-gray-500"
          aria-label="Auction date and time left"
        >
          <div className="flex items-center gap-2">
            <Image
              src="/Calendar-Month-Icon.svg"
              alt="Calendar icon"
              width={16}
              height={16}
              className="shrink-0"
            />
            <span className='text-[14px] font-[350]'>{auctionDate}</span>
          </div>
          <div className="text-green-600 mt-1 flex items-center gap-2">
            <Image
              src="/Clock.svg"
              alt="Clock icon"
              width={16}
              height={16}
              className="shrink-0"
            />
            <span className='text-[14px] font-[350]'>{timeLeft}</span>
          </div>
        </div>

        <BidBox currentBid={currentBid} priceNew={priceNew} />

        <button
          className="mb-4 bg-[#FFB839] hover:bg-yellow-300 text-[14px] border border-[#BF8A2B] font-[350] text-black py-2 rounded max-w-[272px]"
          aria-label={`Place a bid for ${title}`}
        >
          Bid Now
        </button>
      </div>
    </div>
  );
}
