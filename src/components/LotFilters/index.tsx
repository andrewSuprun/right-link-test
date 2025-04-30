'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '../../lib/utils';
import { useFilterStore } from '../../domains/lots/store';
import { getMakesAndModels } from '../../domains/lots/api';

const auctionTypes = [
  { label: 'Copart', value: 1 },
  { label: 'IAAI', value: 2 },
];

const SelectArrowIcon = ({ open }: { open: boolean }) => (
  <Image
    src="/Vector.svg"
    alt="Toggle Arrow"
    width={10}
    height={10}
    className={cn('transition-transform', open && 'rotate-180')}
  />
);

const renderCustomSelect = (
  value: number,
  onChange: (v: number) => void,
  moreToTheLeft = false,
  id: string
) => (
  <select
    id={id}
    value={value}
    onChange={(e) => onChange(+e.target.value)}
    className="w-full px-2 py-1 rounded appearance-none pr-6 font-[350]"
    style={{
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none',
      backgroundImage: 'url("/Vector-down.svg")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: `right ${moreToTheLeft ? '0rem' : '0.5rem'} center`,
      backgroundSize: '0.66rem',
    }}
  >
    {Array.from({ length: 40 }, (_, i) => 1990 + i).map((y) => (
      <option key={y} value={y}>{y}</option>
    ))}
  </select>
);

const FilterSection = ({
  title,
  isOpen,
  toggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="border border-[#E6E9EC] bg-white rounded-lg overflow-hidden">
    <button
      type="button"
      onClick={toggle}
      aria-expanded={isOpen}
      className="flex justify-between items-center w-full px-4 py-3 font-semibold border-b border-[#E6E9EC]"
    >
      <span className='font-[350]'>{title}</span>
      <SelectArrowIcon open={isOpen} />
    </button>
    {isOpen && children}
  </div>
);

export const CarFilters = () => {
  const { filters, setFilters } = useFilterStore();
  const [makesModels, setMakesModels] = useState<{ make: string; models: string[] }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuctionOpen, setIsAuctionOpen] = useState(true);
  const [isYearOpen, setIsYearOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);

  useEffect(() => {
    getMakesAndModels().then(setMakesModels);
  }, []);

  const updateFilters = useCallback((updated: Partial<typeof filters>) => {
    setFilters({ ...filters, ...updated });
  }, [filters, setFilters]);

  const toggleArrayFilter = useCallback((arr: string[] | number[] = [], value: string | number) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
  []);

  const filteredMakes = useMemo(() =>
    makesModels
      .map(({ make }) => make)
      .filter((m) => m.toLowerCase().includes(searchTerm.toLowerCase())),
  [makesModels, searchTerm]);

  const modelsForMake = useMemo(() =>
    makesModels
      .filter((m) => filters.make?.includes(m.make))
      .flatMap((m) => m.models),
  [filters.make, makesModels]);

  return (
    <div className="w-[302px] space-y-4 text-sm text-black">

      <FilterSection title="Auction Type" isOpen={isAuctionOpen} toggle={() => setIsAuctionOpen(!isAuctionOpen)}>
        <div className="px-4 py-3 space-y-2">
          {auctionTypes.map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 border-2 border-gray-400 rounded appearance-none checked:bg-gray-300"
                checked={filters.site?.includes(value) || false}
                onChange={() => updateFilters({ site: toggleArrayFilter(filters.site, value) })}
              />
              <span className='font-[350]'>{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Year" isOpen={isYearOpen} toggle={() => setIsYearOpen(!isYearOpen)}>
        <div className="relative flex px-4 py-3 gap-2">
          {renderCustomSelect(filters.year_from || 2000, (newFrom) => {
            const to = filters.year_to || new Date().getFullYear();
            updateFilters({ year_from: newFrom, year_to: newFrom > to ? newFrom : to });
          }, false, 'year_from')}

          {renderCustomSelect(filters.year_to || new Date().getFullYear(), (newTo) => {
            const from = filters.year_from || 1990;
            updateFilters({ year_from: newTo < from ? newTo : from, year_to: newTo });
          }, true, 'year_to')}
        </div>
      </FilterSection>

      <FilterSection title="Brand" isOpen={isBrandOpen} toggle={() => setIsBrandOpen(!isBrandOpen)}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          aria-label="Search brand"
          className="w-full p-3 text-sm placeholder:text-[#A0A4A8] text-[#A0A4A8] focus:outline-none"
        />
        <div className="border-t border-[#E6E9EC] w-full"></div>
        <div className="px-4 pt-4  pb-2 max-h-[298px] overflow-y-auto custom-scroll">
          {filteredMakes.map((b) => (
            <label key={b} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 border-2  border-gray-400 rounded appearance-none checked:bg-gray-300"
                checked={filters.make?.includes(b) || false}
                onChange={() => updateFilters({ make: toggleArrayFilter(filters.make, b), model: '' })}
              />
              <span className='font-[350]'>{b}</span>
            </label>
          ))}
        </div>
      </FilterSection>

        <div className="border border-[#E6E9EC] bg-white rounded-lg px-4 py-3">
          <select
            id="model"
            aria-label="Model select"
            value={filters.model || ''}
            onChange={(e) => updateFilters({ model: e.target.value })}
            className="w-full px-2 py-1 rounded appearance-none pr-6"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              backgroundImage: 'url("/Vector-down.svg")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '0.7rem',
            }}
          >
            <option value="">Model</option>
            {modelsForMake.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
    </div>
  );
};
