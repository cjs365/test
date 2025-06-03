'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import StockLayout from '@/app/components/layout/StockLayout';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

type ComparisonView = 'operations' | 'valuation' | 'momentum';
type MomentumPeriod = '1M' | '3M' | '6M' | 'YTD';

type PeerSymbol = 'ASML' | 'ASM' | 'BESI' | 'SMHN' | 'KUI' | 'AIXA' | 'AP2';

type PeerMetrics = {
  [K in PeerSymbol]: number;
};

type PeerCompany = {
  symbol: PeerSymbol;
  name: string;
};

type OperationalData = {
  aroic: {
    LFY: PeerMetrics;
    NTM: PeerMetrics;
  };
  assetGrowth: {
    LFY: PeerMetrics;
    NTM: PeerMetrics;
  };
};

type ValuationDataPoint = {
  date: string;
} & PeerMetrics;

type ValuationData = {
  evEE: ValuationDataPoint[];
  evIC: ValuationDataPoint[];
};

type YearlyPerfDataPoint = {
  year: string;
} & PeerMetrics;

type MomentumData = {
  monthlyPerf: {
    [K in MomentumPeriod]: PeerMetrics;
  };
  yearlyPerf: YearlyPerfDataPoint[];
};

type ScoreMetric = {
  metric: string;
  score: number;
  prevScore: number;
};

// Mock peer companies data
const mockPeers: PeerCompany[] = [
  { symbol: 'ASML', name: 'ASML Holding N.V.' },
  { symbol: 'ASM', name: 'ASM International NV' },
  { symbol: 'BESI', name: 'BE Semiconductor Industries N.V.' },
  { symbol: 'SMHN', name: 'SUSS MicroTec SE' },
  { symbol: 'KUI', name: 'Kulicke and Soffa Industries, Inc.' },
  { symbol: 'AIXA', name: 'AIXTRON SE' },
  { symbol: 'AP2', name: 'Applied Materials, Inc.' },
];

// Mock operational metrics data
const mockOperationalData: OperationalData = {
  aroic: {
    LFY: {
      ASML: 32.5, ASM: 28.4, BESI: 25.6, SMHN: 18.9, KUI: 22.3, AIXA: 20.1, AP2: 24.8
    },
    NTM: {
      ASML: 34.2, ASM: 29.8, BESI: 26.9, SMHN: 19.5, KUI: 23.1, AIXA: 21.4, AP2: 25.9
    }
  },
  assetGrowth: {
    LFY: {
      ASML: 15.2, ASM: 12.4, BESI: 10.8, SMHN: 8.5, KUI: 9.2, AIXA: 7.8, AP2: 11.3
    },
    NTM: {
      ASML: 16.8, ASM: 13.5, BESI: 11.9, SMHN: 9.1, KUI: 9.8, AIXA: 8.4, AP2: 12.1
    }
  }
};

// Mock valuation metrics data
const mockValuationData: ValuationData = {
  evEE: [
    { date: '2023-Q1', ASML: 18.2, ASM: 15.4, BESI: 14.8, SMHN: 12.5, KUI: 13.2, AIXA: 11.8, AP2: 16.3 },
    { date: '2023-Q2', ASML: 19.5, ASM: 16.2, BESI: 15.5, SMHN: 13.1, KUI: 13.8, AIXA: 12.4, AP2: 17.1 },
    { date: '2023-Q3', ASML: 20.8, ASM: 17.1, BESI: 16.2, SMHN: 13.8, KUI: 14.5, AIXA: 13.1, AP2: 17.8 },
    { date: '2023-Q4', ASML: 22.1, ASM: 18.0, BESI: 16.9, SMHN: 14.5, KUI: 15.2, AIXA: 13.8, AP2: 18.5 }
  ],
  evIC: [
    { date: '2023-Q1', ASML: 22.5, ASM: 19.8, BESI: 18.2, SMHN: 15.4, KUI: 16.8, AIXA: 14.5, AP2: 20.1 },
    { date: '2023-Q2', ASML: 23.8, ASM: 20.5, BESI: 19.1, SMHN: 16.2, KUI: 17.5, AIXA: 15.2, AP2: 21.0 },
    { date: '2023-Q3', ASML: 25.1, ASM: 21.2, BESI: 20.0, SMHN: 17.0, KUI: 18.2, AIXA: 15.9, AP2: 21.9 },
    { date: '2023-Q4', ASML: 26.4, ASM: 22.0, BESI: 20.9, SMHN: 17.8, KUI: 19.0, AIXA: 16.6, AP2: 22.8 }
  ]
};

// Mock momentum data
const mockMomentumData: MomentumData = {
  monthlyPerf: {
    '1M': { ASML: 5.2, ASM: 4.8, BESI: 3.9, SMHN: 2.8, KUI: 3.5, AIXA: 2.9, AP2: 4.2 },
    '3M': { ASML: 12.5, ASM: 11.2, BESI: 9.8, SMHN: 7.5, KUI: 8.9, AIXA: 7.2, AP2: 10.5 },
    '6M': { ASML: 22.8, ASM: 19.5, BESI: 18.2, SMHN: 15.4, KUI: 16.8, AIXA: 14.5, AP2: 20.1 },
    'YTD': { ASML: 28.5, ASM: 25.4, BESI: 22.8, SMHN: 18.9, KUI: 20.5, AIXA: 17.8, AP2: 24.2 }
  },
  yearlyPerf: [
    { year: '2021', ASML: 38.5, ASM: 34.2, BESI: 30.8, SMHN: 24.2, KUI: 27.5, AIXA: 22.8, AP2: 33.2 },
    { year: '2022', ASML: 28.2, ASM: 25.1, BESI: 22.5, SMHN: 17.8, KUI: 20.2, AIXA: 16.5, AP2: 24.8 },
    { year: '2023', ASML: 42.8, ASM: 38.5, BESI: 35.2, SMHN: 28.5, KUI: 32.1, AIXA: 26.8, AP2: 37.5 },
    { year: '2024 YTD', ASML: 15.2, ASM: 13.8, BESI: 12.5, SMHN: 10.2, KUI: 11.5, AIXA: 9.8, AP2: 14.2 }
  ]
};

// Update share price performance data to monthly
const mockSharePriceData = [
  // 2021
  { date: '2021-01', ASML: 100, ASM: 100, BESI: 100, SMHN: 100, KUI: 100, AIXA: 100, AP2: 100 },
  { date: '2021-02', ASML: 105, ASM: 103, BESI: 102, SMHN: 101, KUI: 102, AIXA: 101, AP2: 104 },
  { date: '2021-03', ASML: 110, ASM: 108, BESI: 105, SMHN: 103, KUI: 104, AIXA: 102, AP2: 107 },
  { date: '2021-04', ASML: 115, ASM: 112, BESI: 108, SMHN: 105, KUI: 107, AIXA: 104, AP2: 110 },
  { date: '2021-05', ASML: 122, ASM: 118, BESI: 114, SMHN: 108, KUI: 111, AIXA: 107, AP2: 116 },
  { date: '2021-06', ASML: 128, ASM: 124, BESI: 118, SMHN: 112, KUI: 115, AIXA: 110, AP2: 122 },
  { date: '2021-07', ASML: 132, ASM: 128, BESI: 122, SMHN: 115, KUI: 118, AIXA: 112, AP2: 125 },
  { date: '2021-08', ASML: 135, ASM: 130, BESI: 125, SMHN: 118, KUI: 121, AIXA: 115, AP2: 128 },
  { date: '2021-09', ASML: 138, ASM: 134, BESI: 128, SMHN: 121, KUI: 124, AIXA: 118, AP2: 131 },
  { date: '2021-10', ASML: 142, ASM: 137, BESI: 132, SMHN: 124, KUI: 127, AIXA: 120, AP2: 134 },
  { date: '2021-11', ASML: 145, ASM: 140, BESI: 135, SMHN: 127, KUI: 130, AIXA: 123, AP2: 137 },
  { date: '2021-12', ASML: 148, ASM: 143, BESI: 138, SMHN: 130, KUI: 133, AIXA: 126, AP2: 140 },
  // 2022
  { date: '2022-01', ASML: 145, ASM: 140, BESI: 135, SMHN: 127, KUI: 130, AIXA: 123, AP2: 137 },
  { date: '2022-02', ASML: 142, ASM: 138, BESI: 132, SMHN: 124, KUI: 127, AIXA: 120, AP2: 134 },
  { date: '2022-03', ASML: 148, ASM: 143, BESI: 138, SMHN: 130, KUI: 133, AIXA: 126, AP2: 140 },
  { date: '2022-04', ASML: 152, ASM: 147, BESI: 142, SMHN: 134, KUI: 137, AIXA: 130, AP2: 144 },
  { date: '2022-05', ASML: 155, ASM: 150, BESI: 145, SMHN: 137, KUI: 140, AIXA: 133, AP2: 147 },
  { date: '2022-06', ASML: 158, ASM: 153, BESI: 148, SMHN: 140, KUI: 143, AIXA: 136, AP2: 150 },
  { date: '2022-07', ASML: 162, ASM: 157, BESI: 152, SMHN: 144, KUI: 147, AIXA: 140, AP2: 154 },
  { date: '2022-08', ASML: 165, ASM: 160, BESI: 155, SMHN: 147, KUI: 150, AIXA: 143, AP2: 157 },
  { date: '2022-09', ASML: 168, ASM: 163, BESI: 158, SMHN: 150, KUI: 153, AIXA: 146, AP2: 160 },
  { date: '2022-10', ASML: 172, ASM: 167, BESI: 162, SMHN: 154, KUI: 157, AIXA: 150, AP2: 164 },
  { date: '2022-11', ASML: 175, ASM: 170, BESI: 165, SMHN: 157, KUI: 160, AIXA: 153, AP2: 167 },
  { date: '2022-12', ASML: 178, ASM: 173, BESI: 168, SMHN: 160, KUI: 163, AIXA: 156, AP2: 170 },
  // 2023
  { date: '2023-01', ASML: 182, ASM: 177, BESI: 172, SMHN: 164, KUI: 167, AIXA: 160, AP2: 174 },
  { date: '2023-02', ASML: 185, ASM: 180, BESI: 175, SMHN: 167, KUI: 170, AIXA: 163, AP2: 177 },
  { date: '2023-03', ASML: 188, ASM: 183, BESI: 178, SMHN: 170, KUI: 173, AIXA: 166, AP2: 180 },
  { date: '2023-04', ASML: 192, ASM: 187, BESI: 182, SMHN: 174, KUI: 177, AIXA: 170, AP2: 184 },
  { date: '2023-05', ASML: 195, ASM: 190, BESI: 185, SMHN: 177, KUI: 180, AIXA: 173, AP2: 187 },
  { date: '2023-06', ASML: 198, ASM: 193, BESI: 188, SMHN: 180, KUI: 183, AIXA: 176, AP2: 190 },
  { date: '2023-07', ASML: 202, ASM: 197, BESI: 192, SMHN: 184, KUI: 187, AIXA: 180, AP2: 194 },
  { date: '2023-08', ASML: 205, ASM: 200, BESI: 195, SMHN: 187, KUI: 190, AIXA: 183, AP2: 197 },
  { date: '2023-09', ASML: 208, ASM: 203, BESI: 198, SMHN: 190, KUI: 193, AIXA: 186, AP2: 200 },
  { date: '2023-10', ASML: 212, ASM: 207, BESI: 202, SMHN: 194, KUI: 197, AIXA: 190, AP2: 204 },
  { date: '2023-11', ASML: 215, ASM: 210, BESI: 205, SMHN: 197, KUI: 200, AIXA: 193, AP2: 207 },
  { date: '2023-12', ASML: 218, ASM: 213, BESI: 208, SMHN: 200, KUI: 203, AIXA: 196, AP2: 210 }
];

// Mock scorecard data
const mockScorecard: ScoreMetric[] = [
  { metric: 'Quality', score: 85, prevScore: 78 },
  { metric: 'Momentum', score: 72, prevScore: 81 },
  { metric: 'Valuation', score: 65, prevScore: 70 },
  { metric: 'Growth', score: 78, prevScore: 75 },
  { metric: 'Risk', score: 82, prevScore: 80 }
];

export default function PeersPage({ params }: { params: { symbol: string } }) {
  const [selectedPeers, setSelectedPeers] = useState<PeerSymbol[]>(['ASML', 'ASM', 'BESI']);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<ComparisonView>('operations');
  const [momentumPeriod, setMomentumPeriod] = useState<MomentumPeriod>('3M');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const mockCompanyData = {
    name: 'Apple Inc',
    symbol: params.symbol,
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPeers = useMemo(() => {
    return mockPeers.filter(peer => 
      peer.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleRemovePeer = (peerToRemove: PeerSymbol) => {
    setSelectedPeers(prev => prev.filter(p => p !== peerToRemove));
  };

  const handleAddPeer = (peerToAdd: PeerSymbol) => {
    if (!selectedPeers.includes(peerToAdd)) {
      setSelectedPeers(prev => [...prev, peerToAdd]);
    }
  };

  const renderOperationsView = () => {
    const aroicData = selectedPeers.map(peer => ({
      name: peer,
      LFY: mockOperationalData.aroic.LFY[peer],
      NTM: mockOperationalData.aroic.NTM[peer]
    }));

    const assetGrowthData = selectedPeers.map(peer => ({
      name: peer,
      LFY: mockOperationalData.assetGrowth.LFY[peer],
      NTM: mockOperationalData.assetGrowth.NTM[peer]
    }));

    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">AROIC Comparison</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aroicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="LFY" fill="#8884d8" name="LFY AROIC" />
              <Bar dataKey="NTM" fill="#82ca9d" name="NTM AROIC" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Asset Growth Comparison</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="LFY" fill="#8884d8" name="LFY Growth" />
              <Bar dataKey="NTM" fill="#82ca9d" name="NTM Growth" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderValuationView = () => {
    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">EV/EE Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockValuationData.evEE}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedPeers.map((peer, index) => (
                <Line
                  key={peer}
                  type="monotone"
                  dataKey={peer}
                  stroke={`hsl(${index * 45}, 70%, 50%)`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">EV/IC Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockValuationData.evIC}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedPeers.map((peer, index) => (
                <Line
                  key={peer}
                  type="monotone"
                  dataKey={peer}
                  stroke={`hsl(${index * 45}, 70%, 50%)`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderMomentumView = () => {
    // Filter share price data based on selected period
    const getFilteredSharePriceData = () => {
      const now = new Date('2023-12-31'); // Use last available data point as reference
      const monthsToShow = momentumPeriod === '1M' ? 1 : 
                          momentumPeriod === '3M' ? 3 :
                          momentumPeriod === '6M' ? 6 : 12; // YTD
      
      const cutoffDate = new Date(now);
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsToShow);
      const cutoffString = cutoffDate.toISOString().slice(0, 7); // YYYY-MM format

      return mockSharePriceData.filter(d => d.date >= cutoffString);
    };

    return (
      <div className="grid grid-cols-1 gap-4">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold">Share Price Performance (Last 3 Years)</h3>
            <div className="flex gap-2">
              {(['1M', '3M', '6M', 'YTD'] as MomentumPeriod[]).map((period) => (
                <Button
                  key={period}
                  variant={momentumPeriod === period ? "default" : "outline"}
                  onClick={() => setMomentumPeriod(period)}
                  className="h-8"
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getFilteredSharePriceData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    const [year, month] = date.split('-');
                    return `${month}/${year.slice(2)}`;
                  }}
                />
                <YAxis 
                  domain={[80, 220]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Index']}
                  labelFormatter={(date) => {
                    const [year, month] = date.split('-');
                    return `${month}/${year}`;
                  }}
                />
                <Legend />
                {selectedPeers.map((peer, index) => (
                  <Line
                    key={peer}
                    type="monotone"
                    dataKey={peer}
                    stroke={`hsl(${index * 45}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Yearly Performance</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockMomentumData.yearlyPerf}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              {selectedPeers.map((peer, index) => (
                <Bar
                  key={peer}
                  dataKey={peer}
                  fill={`hsl(${index * 45}, 70%, 50%)`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <StockLayout 
      symbol={mockCompanyData.symbol}
      companyName={mockCompanyData.name}
    >
      <div className="grid grid-cols-8 gap-4 p-4">
        <div className="col-span-6">
          <div ref={searchRef} className="relative mb-4">
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {selectedPeers.map(peer => (
                <div
                  key={peer}
                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                >
                  <span>{peer}</span>
                  <button
                    onClick={() => handleRemovePeer(peer)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                onClick={() => setIsSearchOpen(true)}
                placeholder="Search peers..."
                className="flex-1 outline-none min-w-[150px]"
              />
            </div>
            {isSearchOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                {filteredPeers.map(peer => (
                  <button
                    key={peer.symbol}
                    onClick={() => {
                      handleAddPeer(peer.symbol as PeerSymbol);
                      setSearchTerm('');
                      setIsSearchOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    <div>{peer.symbol}</div>
                    <div className="text-sm text-gray-500">{peer.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4 flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={view === 'operations' ? "default" : "outline"}
                onClick={() => setView('operations')}
              >
                Operations
              </Button>
              <Button
                variant={view === 'valuation' ? "default" : "outline"}
                onClick={() => setView('valuation')}
              >
                Valuation
              </Button>
              <Button
                variant={view === 'momentum' ? "default" : "outline"}
                onClick={() => setView('momentum')}
              >
                Momentum
              </Button>
            </div>
          </div>

          {view === 'operations' && renderOperationsView()}
          {view === 'valuation' && renderValuationView()}
          {view === 'momentum' && renderMomentumView()}
        </div>

        <div className="col-span-2 border-l pl-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Scorecard</h3>
            <div className="space-y-4">
              {mockScorecard.map(({ metric, score, prevScore }) => (
                <div key={metric} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3 text-xs text-gray-600">{metric}</div>
                  <div className="col-span-7">
                    <div className="relative">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      {/* Historical score indicator */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-black"
                        style={{ 
                          left: `${prevScore}%`,
                          transform: 'translateX(-50%)'
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="font-mono text-xs">{score}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3 text-xs font-medium text-gray-600">Overall</div>
                  <div className="col-span-7">
                    <div className="relative">
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: '76%' }}
                        />
                      </div>
                      {/* Historical score indicator */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-black"
                        style={{ 
                          left: '71%',
                          transform: 'translateX(-50%)'
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="font-mono text-xs">76</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-4 text-xs text-gray-500 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-black"></div>
                  <span>Previous</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StockLayout>
  );
} 