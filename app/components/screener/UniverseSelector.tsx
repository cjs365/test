'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useTheme } from '@/app/context/ThemeProvider';

const countries = [
  { value: 'US', label: 'United States', count: 520 },
  { value: 'GB', label: 'United Kingdom', count: 150 },
  { value: 'JP', label: 'Japan', count: 225 },
  { value: 'DE', label: 'Germany', count: 180 },
];

const sectors = [
  { value: 'all', label: 'All Sectors' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'financial', label: 'Financial Services' },
  { value: 'consumer-cyclical', label: 'Consumer Cyclical' },
  { value: 'industrials', label: 'Industrials' },
  { value: 'communication', label: 'Communication Services' },
  { value: 'consumer-defensive', label: 'Consumer Defensive' },
  { value: 'energy', label: 'Energy' },
  { value: 'basic-materials', label: 'Basic Materials' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'utilities', label: 'Utilities' },
];

type UniverseSelectorProps = {
  onCountryChange: (country: string) => void;
  onSectorChange: (sector: string | null) => void;
};

export default function UniverseSelector({
  onCountryChange,
  onSectorChange,
}: UniverseSelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedSector, setSelectedSector] = useState('all');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    onCountryChange(value);
  };

  const handleSectorChange = (value: string) => {
    setSelectedSector(value);
    onSectorChange(value === 'all' ? null : value);
  };

  return (
    <div className="bg-transparent">
      <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Universe</h2>
      <div className="space-y-3">
        <div>
          <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
            Country
          </label>
          <Select value={selectedCountry} onValueChange={handleCountryChange}>
            <SelectTrigger className={`w-full text-xs h-8 ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent className={
              isDark 
                ? 'bg-gray-800 border-gray-700 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-900'
            }>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  <div className="flex justify-between items-center w-full">
                    <span>{country.label}</span>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{country.count}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
            Sector
          </label>
          <Select value={selectedSector} onValueChange={handleSectorChange}>
            <SelectTrigger className={`w-full text-xs h-8 ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <SelectValue placeholder="Select a sector" />
            </SelectTrigger>
            <SelectContent className={
              isDark 
                ? 'bg-gray-800 border-gray-700 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-900'
            }>
              {sectors.map((sector) => (
                <SelectItem key={sector.value} value={sector.value}>
                  {sector.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 