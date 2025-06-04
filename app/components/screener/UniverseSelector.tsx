'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/app/context/ThemeProvider';
import { Input } from '@/app/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, InfoIcon, X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const countries = [
  { value: 'all', label: 'All Countries' },
  { value: 'US', label: 'United States' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'CN', label: 'China' },
  { value: 'JP', label: 'Japan' },
  { value: 'DE', label: 'Germany' },
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
  onCountryChange: (countries: string[]) => void;
  onSectorChange: (sectors: string[]) => void;
  onMarketCapChange?: (min: number | null, max: number | null) => void;
};

export default function UniverseSelector({
  onCountryChange,
  onSectorChange,
  onMarketCapChange = () => {},
}: UniverseSelectorProps) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['all']);
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['all']);
  const [minMarketCap, setMinMarketCap] = useState<string>('');
  const [maxMarketCap, setMaxMarketCap] = useState<string>('');
  const [countriesDropdownOpen, setCountriesDropdownOpen] = useState(false);
  const [sectorsDropdownOpen, setSectorsDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [sectorSearchTerm, setSectorSearchTerm] = useState('');
  const countryInputRef = useRef<HTMLInputElement>(null);
  const sectorInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleCountryToggle = (value: string) => {
    setSelectedCountries((current) => {
      // Special handling for "All Countries"
      if (value === 'all') {
        return ['all'];
      }
      
      // If we're selecting a specific country, remove "all" from the selection
      const withoutAll = current.filter(item => item !== 'all');
      
      const newSelection = withoutAll.includes(value)
        ? withoutAll.filter(item => item !== value)
        : [...withoutAll, value];
      
      // If no countries are selected, default back to "all"
      if (newSelection.length === 0) return ['all'];
      return newSelection;
    });
    
    setCountrySearchTerm('');
  };

  const handleSectorToggle = (value: string) => {
    setSelectedSectors((current) => {
      // Special handling for "All Sectors"
      if (value === 'all') {
        return ['all'];
      }
      
      // If we're selecting a specific sector, remove "all" from the selection
      const withoutAll = current.filter(item => item !== 'all');
      
      const newSelection = withoutAll.includes(value)
        ? withoutAll.filter(item => item !== value)
        : [...withoutAll, value];
      
      // If no sectors are selected, default back to "all"
      if (newSelection.length === 0) return ['all'];
      return newSelection;
    });
    
    setSectorSearchTerm('');
  };

  const handleMarketCapChange = (type: 'min' | 'max', value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      if (type === 'min') {
        setMinMarketCap(value);
      } else {
        setMaxMarketCap(value);
      }
      
      const minValue = minMarketCap === '' ? null : Number(minMarketCap);
      const maxValue = maxMarketCap === '' ? null : Number(maxMarketCap);
      
      onMarketCapChange(
        type === 'min' ? (value === '' ? null : Number(value)) : minValue,
        type === 'max' ? (value === '' ? null : Number(value)) : maxValue
      );
    }
  };

  // Update parent component when selections change
  useEffect(() => {
    onCountryChange(selectedCountries);
  }, [selectedCountries, onCountryChange]);

  useEffect(() => {
    onSectorChange(selectedSectors);
  }, [selectedSectors, onSectorChange]);

  const removeCountry = (value: string) => {
    if (value === 'all' || selectedCountries.length <= 1) {
      setSelectedCountries(['all']);
    } else {
      setSelectedCountries(selectedCountries.filter(c => c !== value));
    }
  };

  const removeSector = (value: string) => {
    if (value === 'all' || selectedSectors.length <= 1) {
      setSelectedSectors(['all']);
    } else {
      setSelectedSectors(selectedSectors.filter(s => s !== value));
    }
  };

  // Filter countries based on search term
  const filteredCountries = countries.filter(country => 
    country.label.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Filter sectors based on search term
  const filteredSectors = sectors.filter(sector => 
    sector.label.toLowerCase().includes(sectorSearchTerm.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryInputRef.current && !countryInputRef.current.contains(event.target as Node)) {
        setCountriesDropdownOpen(false);
      }
      if (sectorInputRef.current && !sectorInputRef.current.contains(event.target as Node)) {
        setSectorsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-transparent">
      <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Universe</h2>
      <div className="space-y-3">
        <div>
          <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
            Countries
          </label>
          <div className="relative" ref={countryInputRef}>
            <div className="flex flex-wrap gap-1 mb-1">
              {selectedCountries.map(country => {
                const countryObj = countries.find(c => c.value === country);
                return (
                  <Badge 
                    key={country} 
                    variant="secondary"
                    className={`flex items-center gap-1 py-0 h-5 ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {countryObj?.label}
                    <button 
                      className="ml-1 rounded-full focus:outline-none"
                      onClick={() => removeCountry(country)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <Search className={`h-3.5 w-3.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <Input
                type="text"
                value={countrySearchTerm}
                onChange={(e) => setCountrySearchTerm(e.target.value)}
                onFocus={() => setCountriesDropdownOpen(true)}
                placeholder="Search countries..."
                className={`text-xs h-8 pl-8 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                }`}
              />
            </div>
            
            {countriesDropdownOpen && (
              <div className={`absolute z-50 mt-1 w-full rounded-md border shadow-lg ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}>
                <div className="max-h-60 overflow-auto p-1">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map(country => (
                      <div
                        key={country.value}
                        className={`flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-xs ${
                          selectedCountries.includes(country.value)
                            ? isDark 
                              ? 'bg-gray-700 text-gray-200' 
                              : 'bg-gray-100 text-gray-900'
                            : isDark 
                              ? 'text-gray-200 hover:bg-gray-700' 
                              : 'text-gray-900 hover:bg-gray-100'
                        }`}
                        onClick={() => handleCountryToggle(country.value)}
                      >
                        <div className="flex items-center">
                          <div className={`mr-2 h-4 w-4 rounded-sm border flex items-center justify-center ${
                            selectedCountries.includes(country.value)
                              ? isDark 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-blue-600 bg-blue-600'
                              : isDark 
                                ? 'border-gray-600' 
                                : 'border-gray-300'
                          }`}>
                            {selectedCountries.includes(country.value) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span>{country.label}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`px-2 py-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
            Sectors
          </label>
          <div className="relative" ref={sectorInputRef}>
            <div className="flex flex-wrap gap-1 mb-1">
              {selectedSectors.map(sector => {
                const sectorObj = sectors.find(s => s.value === sector);
                return (
                  <Badge 
                    key={sector} 
                    variant="secondary"
                    className={`flex items-center gap-1 py-0 h-5 ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {sectorObj?.label}
                    <button 
                      className="ml-1 rounded-full focus:outline-none"
                      onClick={() => removeSector(sector)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <Search className={`h-3.5 w-3.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <Input
                type="text"
                value={sectorSearchTerm}
                onChange={(e) => setSectorSearchTerm(e.target.value)}
                onFocus={() => setSectorsDropdownOpen(true)}
                placeholder="Search sectors..."
                className={`text-xs h-8 pl-8 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                }`}
              />
            </div>
            
            {sectorsDropdownOpen && (
              <div className={`absolute z-50 mt-1 w-full rounded-md border shadow-lg ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}>
                <div className="max-h-60 overflow-auto p-1">
                  {filteredSectors.length > 0 ? (
                    filteredSectors.map(sector => (
                      <div
                        key={sector.value}
                        className={`flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-xs ${
                          selectedSectors.includes(sector.value)
                            ? isDark 
                              ? 'bg-gray-700 text-gray-200' 
                              : 'bg-gray-100 text-gray-900'
                            : isDark 
                              ? 'text-gray-200 hover:bg-gray-700' 
                              : 'text-gray-900 hover:bg-gray-100'
                        }`}
                        onClick={() => handleSectorToggle(sector.value)}
                      >
                        <div className="flex items-center">
                          <div className={`mr-2 h-4 w-4 rounded-sm border flex items-center justify-center ${
                            selectedSectors.includes(sector.value)
                              ? isDark 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-blue-600 bg-blue-600'
                              : isDark 
                                ? 'border-gray-600' 
                                : 'border-gray-300'
                          }`}>
                            {selectedSectors.includes(sector.value) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span>{sector.label}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`px-2 py-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No sectors found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center mb-1">
            <label className={`block text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              Market Cap (billion USD)
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className={`ml-1 h-3 w-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </TooltipTrigger>
                <TooltipContent className={isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-800'}>
                  <p>Leave empty if no restriction</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={minMarketCap}
              onChange={(e) => handleMarketCapChange('min', e.target.value)}
              placeholder="Min"
              className={`text-xs h-8 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
              }`}
            />
            <span className={isDark ? 'text-gray-400' : 'text-gray-700'}>to</span>
            <Input
              type="text"
              value={maxMarketCap}
              onChange={(e) => handleMarketCapChange('max', e.target.value)}
              placeholder="Max"
              className={`text-xs h-8 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 