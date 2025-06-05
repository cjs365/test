'use client';

import { useState } from 'react';
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
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

type Props = {
  params: {
    industryId: string;
  };
};

type ValuationDataPoint = {
  date: string;
  value: number;
  average?: number;
};

type ScatterDataPoint = {
  x: number;
  y: number;
  z: number;
  name: string;
};

export default function IndustryValuationPage({ params }: Props) {
  const [timeframe, setTimeframe] = useState<'1Y' | '3Y' | '5Y' | '10Y'>('5Y');
  const industryId = params.industryId;

  // Mock data for industry PE ratio history
  const mockPEData: ValuationDataPoint[] = [
    { date: '2014', value: 18.2, average: 16.5 },
    { date: '2015', value: 19.5, average: 16.5 },
    { date: '2016', value: 21.3, average: 16.5 },
    { date: '2017', value: 22.8, average: 16.5 },
    { date: '2018', value: 20.1, average: 16.5 },
    { date: '2019', value: 21.5, average: 16.5 },
    { date: '2020', value: 24.3, average: 16.5 },
    { date: '2021', value: 26.8, average: 16.5 },
    { date: '2022', value: 22.5, average: 16.5 },
    { date: '2023', value: 24.8, average: 16.5 },
  ];

  // Mock data for industry EV/EBITDA history
  const mockEVEBITDAData: ValuationDataPoint[] = [
    { date: '2014', value: 10.2, average: 12.0 },
    { date: '2015', value: 11.5, average: 12.0 },
    { date: '2016', value: 12.3, average: 12.0 },
    { date: '2017', value: 13.8, average: 12.0 },
    { date: '2018', value: 12.1, average: 12.0 },
    { date: '2019', value: 13.5, average: 12.0 },
    { date: '2020', value: 14.3, average: 12.0 },
    { date: '2021', value: 16.8, average: 12.0 },
    { date: '2022', value: 14.5, average: 12.0 },
    { date: '2023', value: 15.7, average: 12.0 },
  ];

  // Mock data for industry Price/Sales history
  const mockPSData: ValuationDataPoint[] = [
    { date: '2014', value: 1.8, average: 2.2 },
    { date: '2015', value: 2.1, average: 2.2 },
    { date: '2016', value: 2.3, average: 2.2 },
    { date: '2017', value: 2.5, average: 2.2 },
    { date: '2018', value: 2.2, average: 2.2 },
    { date: '2019', value: 2.4, average: 2.2 },
    { date: '2020', value: 2.8, average: 2.2 },
    { date: '2021', value: 3.4, average: 2.2 },
    { date: '2022', value: 2.9, average: 2.2 },
    { date: '2023', value: 3.2, average: 2.2 },
  ];

  // Mock data for industry Price/Book history
  const mockPBData: ValuationDataPoint[] = [
    { date: '2014', value: 2.8, average: 3.0 },
    { date: '2015', value: 3.1, average: 3.0 },
    { date: '2016', value: 3.3, average: 3.0 },
    { date: '2017', value: 3.5, average: 3.0 },
    { date: '2018', value: 3.2, average: 3.0 },
    { date: '2019', value: 3.4, average: 3.0 },
    { date: '2020', value: 3.8, average: 3.0 },
    { date: '2021', value: 4.4, average: 3.0 },
    { date: '2022', value: 3.9, average: 3.0 },
    { date: '2023', value: 4.1, average: 3.0 },
  ];

  // Mock data for scatter plot of companies (PE vs ROE)
  const mockCompanyScatterData: ScatterDataPoint[] = [
    { x: 29.5, y: 32.4, z: 2800, name: 'AAPL' },
    { x: 34.8, y: 28.7, z: 2700, name: 'MSFT' },
    { x: 68.2, y: 41.2, z: 2200, name: 'NVDA' },
    { x: 42.1, y: 24.5, z: 292, name: 'ASML' },
    { x: 24.7, y: 21.8, z: 698, name: 'TSM' },
    { x: 85.2, y: 4.3, z: 142, name: 'INTC' },
    { x: 218.9, y: 12.7, z: 244, name: 'AMD' },
    { x: 0, y: 15.8, z: 118, name: 'MU' },
    { x: 45.3, y: 34.2, z: 598, name: 'AVGO' },
    { x: 21.8, y: 26.5, z: 191, name: 'QCOM' },
  ];

  // Filter data based on selected timeframe
  const filterDataByTimeframe = (data: ValuationDataPoint[]) => {
    const years = {
      '1Y': 1,
      '3Y': 3,
      '5Y': 5,
      '10Y': 10
    };
    
    return data.slice(-years[timeframe]);
  };

  const filteredPEData = filterDataByTimeframe(mockPEData);
  const filteredEVEBITDAData = filterDataByTimeframe(mockEVEBITDAData);
  const filteredPSData = filterDataByTimeframe(mockPSData);
  const filteredPBData = filterDataByTimeframe(mockPBData);

  // Get current and average values safely
  const currentPE = mockPEData[mockPEData.length - 1];
  const averagePE = mockPEData[0].average || 0;
  const pePremium = ((currentPE.value / averagePE) - 1) * 100;

  const currentEVEBITDA = mockEVEBITDAData[mockEVEBITDAData.length - 1];
  const averageEVEBITDA = mockEVEBITDAData[0].average || 0;
  const evEbitdaPremium = ((currentEVEBITDA.value / averageEVEBITDA) - 1) * 100;

  const currentPS = mockPSData[mockPSData.length - 1];
  const averagePS = mockPSData[0].average || 0;
  const psPremium = ((currentPS.value / averagePS) - 1) * 100;

  const currentPB = mockPBData[mockPBData.length - 1];
  const averagePB = mockPBData[0].average || 0;
  const pbPremium = ((currentPB.value / averagePB) - 1) * 100;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Valuation Metrics</h1>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 text-sm rounded ${timeframe === '1Y' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('1Y')}
          >
            1Y
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded ${timeframe === '3Y' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('3Y')}
          >
            3Y
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded ${timeframe === '5Y' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('5Y')}
          >
            5Y
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded ${timeframe === '10Y' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('10Y')}
          >
            10Y
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P/E Ratio Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="text-sm font-semibold mb-4">Price to Earnings (P/E) Ratio</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredPEData} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip 
                  formatter={(value: any) => [`${value}`, 'P/E Ratio']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  name="P/E Ratio"
                />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#9ca3af" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                  name="10Y Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Current P/E: <span className="font-semibold">{currentPE.value}</span> | 
            10Y Average: <span className="font-semibold">{averagePE}</span> | 
            Premium: <span className={`font-semibold ${pePremium > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {pePremium.toFixed(1)}%
            </span>
          </p>
        </div>

        {/* EV/EBITDA Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="text-sm font-semibold mb-4">EV/EBITDA</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredEVEBITDAData} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip 
                  formatter={(value: any) => [`${value}`, 'EV/EBITDA']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  name="EV/EBITDA"
                />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#9ca3af" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                  name="10Y Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Current EV/EBITDA: <span className="font-semibold">{currentEVEBITDA.value}</span> | 
            10Y Average: <span className="font-semibold">{averageEVEBITDA}</span> | 
            Premium: <span className={`font-semibold ${evEbitdaPremium > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {evEbitdaPremium.toFixed(1)}%
            </span>
          </p>
        </div>

        {/* Price/Sales Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="text-sm font-semibold mb-4">Price to Sales (P/S) Ratio</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredPSData} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip 
                  formatter={(value: any) => [`${value}`, 'P/S Ratio']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  name="P/S Ratio"
                />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#9ca3af" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                  name="10Y Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Current P/S: <span className="font-semibold">{currentPS.value}</span> | 
            10Y Average: <span className="font-semibold">{averagePS}</span> | 
            Premium: <span className={`font-semibold ${psPremium > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {psPremium.toFixed(1)}%
            </span>
          </p>
        </div>

        {/* Price/Book Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="text-sm font-semibold mb-4">Price to Book (P/B) Ratio</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredPBData} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip 
                  formatter={(value: any) => [`${value}`, 'P/B Ratio']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  name="P/B Ratio"
                />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#9ca3af" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                  name="10Y Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Current P/B: <span className="font-semibold">{currentPB.value}</span> | 
            10Y Average: <span className="font-semibold">{averagePB}</span> | 
            Premium: <span className={`font-semibold ${pbPremium > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {pbPremium.toFixed(1)}%
            </span>
          </p>
        </div>
      </div>

      {/* Company Scatter Plot */}
      <div className="bg-white p-4 border rounded-md">
        <h2 className="text-sm font-semibold mb-4">Company Valuation Comparison (P/E vs ROE)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="P/E Ratio" 
                label={{ value: 'P/E Ratio', position: 'bottom', offset: 0 }}
                domain={[0, 'auto']}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="ROE (%)" 
                label={{ value: 'ROE (%)', angle: -90, position: 'left' }}
              />
              <ZAxis 
                type="number" 
                dataKey="z" 
                range={[50, 400]} 
                name="Market Cap ($B)"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name, props) => {
                  if (name === 'x') return [`${value}`, 'P/E Ratio'];
                  if (name === 'y') return [`${value}%`, 'ROE'];
                  if (name === 'z') return [`$${value}B`, 'Market Cap'];
                  return [value, name];
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border shadow-sm">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-xs">P/E Ratio: {data.x === 0 ? 'N/A' : data.x.toFixed(1)}</p>
                        <p className="text-xs">ROE: {data.y.toFixed(1)}%</p>
                        <p className="text-xs">Market Cap: ${data.z}B</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Scatter 
                name="Companies" 
                data={mockCompanyScatterData} 
                fill="#3b82f6"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Bubble size represents company market capitalization. Companies with higher ROE and lower P/E ratios may represent better value.
        </p>
      </div>

      {/* Valuation Analysis */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h2 className="text-sm font-bold mb-2">Valuation Analysis</h2>
        <p className="text-sm text-gray-600 mb-4">
          {industryId === 'semiconductors' && (
            "The semiconductor industry is currently trading at a premium to its historical average across most valuation metrics. This reflects strong growth expectations driven by AI, cloud computing, and automotive applications. Companies with strong positions in these growth segments command higher multiples, while those facing competitive pressures trade at discounts to the industry average."
          )}
          {industryId !== 'semiconductors' && (
            `The ${industryId} industry is currently valued at ${currentPE.value}x earnings, representing a ${pePremium.toFixed(1)}% premium to its 10-year historical average. This valuation reflects current market conditions, growth expectations, and industry-specific factors.`
          )}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold mb-2">Valuation Drivers</h3>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>Strong revenue growth expectations</li>
              <li>Margin expansion potential</li>
              <li>Technological innovation</li>
              <li>Market consolidation trends</li>
              <li>Regulatory environment</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold mb-2">Valuation Risks</h3>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>Rising interest rate environment</li>
              <li>Supply chain constraints</li>
              <li>Increasing competition</li>
              <li>Technological disruption</li>
              <li>Geopolitical tensions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 