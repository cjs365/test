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
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type ComparisonView = 'operations' | 'valuation' | 'momentum' | 'growth' | 'risk';
type OperationsLayout = 'stacked' | 'sideBySide';
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

type GrowthData = {
  revenueGrowth: {
    fiveYearMedian: PeerMetrics;
    LFY: PeerMetrics;
    NTM: PeerMetrics;
  };
  economicEarnings: {
    fiveYearMedian: PeerMetrics;
    LFY: PeerMetrics;
    NTM: PeerMetrics;
  };
  assetGrowth: {
    fiveYearMedian: PeerMetrics;
    LFY: PeerMetrics;
    NTM: PeerMetrics;
  };
  capitalDeployment: {
    growthRatio: PeerMetrics;
    debtRepaymentRatio: PeerMetrics;
    shareholderReturnsRatio: PeerMetrics;
  };
};

type RiskData = {
  leverageRatio: {
    current: PeerMetrics;
    historical: {
      [year: string]: PeerMetrics;
    };
  };
  probabilityOfDefault: {
    current: PeerMetrics;
    historical: {
      [year: string]: PeerMetrics;
    };
  };
  creditRating: {
    [K in PeerSymbol]: string;
  };
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

// Mock growth metrics data
const mockGrowthData: GrowthData = {
  revenueGrowth: {
    fiveYearMedian: {
      ASML: 18.7, ASM: 16.5, BESI: 14.2, SMHN: 10.8, KUI: 12.4, AIXA: 11.5, AP2: 15.3
    },
    LFY: {
      ASML: 21.3, ASM: 18.9, BESI: 16.7, SMHN: 12.5, KUI: 14.8, AIXA: 13.2, AP2: 17.6
    },
    NTM: {
      ASML: 19.8, ASM: 17.2, BESI: 15.4, SMHN: 11.9, KUI: 13.5, AIXA: 12.8, AP2: 16.4
    }
  },
  economicEarnings: {
    fiveYearMedian: {
      ASML: 22.4, ASM: 19.8, BESI: 17.5, SMHN: 13.2, KUI: 15.6, AIXA: 14.3, AP2: 18.9
    },
    LFY: {
      ASML: 25.6, ASM: 22.3, BESI: 19.8, SMHN: 15.4, KUI: 17.9, AIXA: 16.2, AP2: 21.5
    },
    NTM: {
      ASML: 27.1, ASM: 23.8, BESI: 21.2, SMHN: 16.7, KUI: 19.3, AIXA: 17.5, AP2: 22.9
    }
  },
  assetGrowth: {
    fiveYearMedian: {
      ASML: 12.8, ASM: 10.9, BESI: 9.5, SMHN: 7.2, KUI: 8.4, AIXA: 7.0, AP2: 10.2
    },
    LFY: {
      ASML: 15.2, ASM: 12.4, BESI: 10.8, SMHN: 8.5, KUI: 9.2, AIXA: 7.8, AP2: 11.3
    },
    NTM: {
      ASML: 16.8, ASM: 13.5, BESI: 11.9, SMHN: 9.1, KUI: 9.8, AIXA: 8.4, AP2: 12.1
    }
  },
  capitalDeployment: {
    growthRatio: {
      ASML: 0.65, ASM: 0.58, BESI: 0.52, SMHN: 0.48, KUI: 0.45, AIXA: 0.42, AP2: 0.55
    },
    debtRepaymentRatio: {
      ASML: 0.15, ASM: 0.17, BESI: 0.18, SMHN: 0.22, KUI: 0.25, AIXA: 0.28, AP2: 0.15
    },
    shareholderReturnsRatio: {
      ASML: 0.20, ASM: 0.25, BESI: 0.30, SMHN: 0.30, KUI: 0.30, AIXA: 0.30, AP2: 0.30
    }
  }
};

// Mock risk metrics data
const mockRiskData: RiskData = {
  leverageRatio: {
    current: {
      ASML: 0.18, ASM: 0.22, BESI: 0.25, SMHN: 0.32, KUI: 0.35, AIXA: 0.38, AP2: 0.28
    },
    historical: {
      '2019': { ASML: 0.24, ASM: 0.28, BESI: 0.32, SMHN: 0.38, KUI: 0.42, AIXA: 0.45, AP2: 0.35 },
      '2020': { ASML: 0.22, ASM: 0.26, BESI: 0.30, SMHN: 0.36, KUI: 0.40, AIXA: 0.43, AP2: 0.33 },
      '2021': { ASML: 0.20, ASM: 0.24, BESI: 0.28, SMHN: 0.34, KUI: 0.38, AIXA: 0.41, AP2: 0.31 },
      '2022': { ASML: 0.19, ASM: 0.23, BESI: 0.26, SMHN: 0.33, KUI: 0.36, AIXA: 0.39, AP2: 0.29 },
      '2023': { ASML: 0.18, ASM: 0.22, BESI: 0.25, SMHN: 0.32, KUI: 0.35, AIXA: 0.38, AP2: 0.28 }
    }
  },
  probabilityOfDefault: {
    current: {
      ASML: 0.12, ASM: 0.18, BESI: 0.22, SMHN: 0.35, KUI: 0.38, AIXA: 0.42, AP2: 0.25
    },
    historical: {
      '2019': { ASML: 0.25, ASM: 0.32, BESI: 0.38, SMHN: 0.48, KUI: 0.52, AIXA: 0.55, AP2: 0.42 },
      '2020': { ASML: 0.22, ASM: 0.28, BESI: 0.34, SMHN: 0.45, KUI: 0.48, AIXA: 0.52, AP2: 0.38 },
      '2021': { ASML: 0.18, ASM: 0.24, BESI: 0.28, SMHN: 0.42, KUI: 0.45, AIXA: 0.48, AP2: 0.32 },
      '2022': { ASML: 0.15, ASM: 0.21, BESI: 0.25, SMHN: 0.38, KUI: 0.42, AIXA: 0.45, AP2: 0.28 },
      '2023': { ASML: 0.12, ASM: 0.18, BESI: 0.22, SMHN: 0.35, KUI: 0.38, AIXA: 0.42, AP2: 0.25 }
    }
  },
  creditRating: {
    ASML: 'AA-', ASM: 'A+', BESI: 'A', SMHN: 'BBB+', KUI: 'BBB', AIXA: 'BBB-', AP2: 'A-'
  }
};

// Create a sortable peer item component
function SortablePeerItem({ peer, onRemove }: { peer: PeerSymbol, onRemove: (peer: PeerSymbol) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: peer });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
    >
      <span>{peer}</span>
      <button
        onClick={() => onRemove(peer)}
        className="text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </div>
  );
}

export default function PeersPage({ params }: { params: { symbol: string } }) {
  const [selectedPeers, setSelectedPeers] = useState<PeerSymbol[]>(['ASML', 'ASM', 'BESI']);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<ComparisonView>('operations');
  const [operationsLayout, setOperationsLayout] = useState<OperationsLayout>('stacked');
  const [momentumPeriod, setMomentumPeriod] = useState<MomentumPeriod>('3M');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
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
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSelectedPeers((peers) => {
        const oldIndex = peers.indexOf(active.id as PeerSymbol);
        const newIndex = peers.indexOf(over.id as PeerSymbol);
        return arrayMove(peers, oldIndex, newIndex);
      });
    }
  };

  const renderOperationsView = () => {
    if (operationsLayout === 'stacked') {
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
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOperationsLayout('sideBySide')}
              className="text-xs"
            >
              Side by Side View
            </Button>
          </div>
          <div className="h-80">
            <h3 className="text-lg font-semibold mb-2">AROIC Comparison</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aroicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value: any) => [`${value}%`, '']} />
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
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value: any) => [`${value}%`, '']} />
                <Legend />
                <Bar dataKey="LFY" fill="#8884d8" name="LFY Growth" />
                <Bar dataKey="NTM" fill="#82ca9d" name="NTM Growth" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    } else {
      // Side by side view - show individual charts for all selected peers
      const topPeers = selectedPeers;
      
      // Create historical trend data for each company
      const createHistoricalData = (peer: PeerSymbol, metric: 'aroic' | 'assetGrowth') => {
        // Create mock historical data points for the selected metric
        const years = Array.from({length: 10}, (_, i) => 2014 + i);
        
        // Base value and growth pattern based on the current LFY value
        const baseValue = metric === 'aroic' 
          ? mockOperationalData.aroic.LFY[peer] 
          : mockOperationalData.assetGrowth.LFY[peer];
        
        // Generate historical trend with some randomness but following a general upward trend
        return years.map(year => {
          // Calculate a value that generally increases over time but with some fluctuation
          const yearIndex = year - 2014;
          const growthFactor = 0.7 + (yearIndex / 10); // Gradually increases over time
          
          // Add some randomness to create a realistic looking chart
          const randomFactor = 0.85 + (Math.random() * 0.3); // Between 0.85 and 1.15
          
          // Calculate the value for this year
          const value = baseValue * (0.6 + (yearIndex * 0.025 * growthFactor)) * randomFactor;
          
          // For future years (estimates)
          const isEstimate = year > 2023;
          
          return {
            year: year > 2023 ? `FY${year - 2023}` : year.toString(),
            value: parseFloat(value.toFixed(1)),
            isEstimate
          };
        });
      };

      return (
        <div>
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOperationsLayout('stacked')}
              className="text-xs"
            >
              Stacked View
            </Button>
          </div>
          
          <div className={`grid grid-cols-1 ${
            topPeers.length === 1 ? 'md:grid-cols-1' : 
            topPeers.length === 2 ? 'md:grid-cols-2' : 
            'md:grid-cols-3'
          } gap-6`}>
            {topPeers.map(peer => (
              <div key={peer} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-center">{peer}</h3>
                
                <div className="h-60 mb-6">
                  <h4 className="text-sm font-medium mb-2">Adjusted Return on Invested Capital (AROIC)</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={createHistoricalData(peer, 'aroic')}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => [`${value}%`, 'AROIC']} />
                      <Bar dataKey="value">
                        {createHistoricalData(peer, 'aroic').map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={entry.isEstimate ? '#bfdbfe' : '#6b7280'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-60">
                  <h4 className="text-sm font-medium mb-2">Asset Growth</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={createHistoricalData(peer, 'assetGrowth')}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => [`${value}%`, 'Asset Growth']} />
                      <Bar dataKey="value">
                        {createHistoricalData(peer, 'assetGrowth').map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={entry.isEstimate ? '#bfdbfe' : '#6b7280'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">AROIC (LFY)</div>
                    <div className="font-bold text-lg">
                      {mockOperationalData.aroic.LFY[peer].toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">AROIC (NTM)</div>
                    <div className="font-bold text-lg">
                      {mockOperationalData.aroic.NTM[peer].toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Asset Growth (LFY)</div>
                    <div className="font-bold text-lg">
                      {mockOperationalData.assetGrowth.LFY[peer].toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Asset Growth (NTM)</div>
                    <div className="font-bold text-lg">
                      {mockOperationalData.assetGrowth.NTM[peer].toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  const renderValuationView = () => {
    // Create data for the valuation metrics
    const createValuationChartData = (metric: 'evEE' | 'evIC') => {
      return mockValuationData[metric].map(dataPoint => {
        const newPoint: any = { date: dataPoint.date };
        selectedPeers.forEach(peer => {
          newPoint[peer] = dataPoint[peer];
        });
        return newPoint;
      });
    };

    const evEEData = createValuationChartData('evEE');
    const evICData = createValuationChartData('evIC');

    // Calculate current values for each selected peer
    const currentValues = selectedPeers.map(peer => {
      return {
        id: peer,
        name: peer,
        evEE: mockValuationData.evEE[mockValuationData.evEE.length - 1][peer],
        evIC: mockValuationData.evIC[mockValuationData.evIC.length - 1][peer]
      };
    });

    return (
      <div className="grid grid-cols-1 gap-6">
        {/* Current Valuation Metrics Table */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Current Valuation Metrics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Company</th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">EV/EBITDA</th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">EV/IC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentValues.map((peer) => (
                  <tr key={peer.id}>
                    <td className="py-2 px-3 text-sm text-gray-900 border-b">{peer.name}</td>
                    <td className="py-2 px-3 text-sm text-gray-900 text-right border-b">{peer.evEE.toFixed(1)}x</td>
                    <td className="py-2 px-3 text-sm text-gray-900 text-right border-b">{peer.evIC.toFixed(1)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EV/EBITDA Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">EV/EBITDA Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evEEData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip formatter={(value: any) => `${value.toFixed(1)}x`} />
              <Legend />
              {selectedPeers.map((peer, index) => (
                <Line
                  key={peer}
                  type="monotone"
                  dataKey={peer}
                  name={peer}
                  stroke={`hsl(${index * 45}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* EV/IC Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">EV/IC Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evICData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip formatter={(value: any) => `${value.toFixed(1)}x`} />
              <Legend />
              {selectedPeers.map((peer, index) => (
                <Line
                  key={peer}
                  type="monotone"
                  dataKey={peer}
                  name={peer}
                  stroke={`hsl(${index * 45}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
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

    // Get performance data for the selected period
    const periodPerformance = mockMomentumData.monthlyPerf[momentumPeriod];
    const performanceData = selectedPeers.map(peer => {
      return {
        name: peer,
        performance: periodPerformance[peer]
      };
    }).sort((a, b) => b.performance - a.performance); // Sort by performance descending

    return (
      <div className="grid grid-cols-1 gap-6">
        {/* Period Performance Bar Chart */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Peer Performance</h3>
            <div className="flex gap-2">
              {(['1M', '3M', '6M', 'YTD'] as MomentumPeriod[]).map((period) => (
                <Button
                  key={period}
                  variant={momentumPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMomentumPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 'dataMax + 2']} tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip formatter={(value: any) => [`${value}%`, 'Performance']} />
                <Bar dataKey="performance" fill="#3b82f6">
                  {performanceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={index === 0 ? '#10b981' : index === performanceData.length - 1 ? '#ef4444' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Share Price Performance Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Share Price Performance (Indexed to 100)</h3>
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
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value}`, 'Index']}
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
                    name={peer}
                    stroke={`hsl(${index * 45}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Performance Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Yearly Performance</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockMomentumData.yearlyPerf}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: any) => `${value}%`} />
              <Legend />
              {selectedPeers.map((peer, index) => (
                <Bar
                  key={peer}
                  dataKey={peer}
                  name={peer}
                  fill={`hsl(${index * 45}, 70%, 50%)`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderGrowthView = () => {
    // Create data for bar charts
    const revenueGrowthData = selectedPeers.map(peer => ({
      name: peer,
      "5Y Median": mockGrowthData.revenueGrowth.fiveYearMedian[peer],
      "LFY": mockGrowthData.revenueGrowth.LFY[peer],
      "NTM": mockGrowthData.revenueGrowth.NTM[peer]
    }));

    const economicEarningsData = selectedPeers.map(peer => ({
      name: peer,
      "5Y Median": mockGrowthData.economicEarnings.fiveYearMedian[peer],
      "LFY": mockGrowthData.economicEarnings.LFY[peer],
      "NTM": mockGrowthData.economicEarnings.NTM[peer]
    }));

    const assetGrowthData = selectedPeers.map(peer => ({
      name: peer,
      "5Y Median": mockGrowthData.assetGrowth.fiveYearMedian[peer],
      "LFY": mockGrowthData.assetGrowth.LFY[peer],
      "NTM": mockGrowthData.assetGrowth.NTM[peer]
    }));

    // Create data for capital deployment chart
    const capitalDeploymentData = selectedPeers.map(peer => ({
      name: peer,
      "Growth": mockGrowthData.capitalDeployment.growthRatio[peer] * 100,
      "Debt Repayment": mockGrowthData.capitalDeployment.debtRepaymentRatio[peer] * 100,
      "Shareholder Returns": mockGrowthData.capitalDeployment.shareholderReturnsRatio[peer] * 100
    }));

    return (
      <div className="grid grid-cols-1 gap-6">
        {/* Revenue Growth */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Revenue Growth</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: any) => [`${value}%`, '']} />
              <Legend />
              <Bar dataKey="5Y Median" fill="#8884d8" />
              <Bar dataKey="LFY" fill="#82ca9d" />
              <Bar dataKey="NTM" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Economic Earnings */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Economic Earnings Growth</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={economicEarningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: any) => [`${value}%`, '']} />
              <Legend />
              <Bar dataKey="5Y Median" fill="#8884d8" />
              <Bar dataKey="LFY" fill="#82ca9d" />
              <Bar dataKey="NTM" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Growth */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Asset Growth</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: any) => [`${value}%`, '']} />
              <Legend />
              <Bar dataKey="5Y Median" fill="#8884d8" />
              <Bar dataKey="LFY" fill="#82ca9d" />
              <Bar dataKey="NTM" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Capital Deployment Strategy */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Capital Deployment Strategy</h3>
          <p className="text-sm text-gray-500 mb-4">How companies allocate their capital between growth investments, debt repayment, and shareholder returns</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={capitalDeploymentData}
                layout="vertical"
                stackOffset="expand"
                barSize={30}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={50} />
                <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, '']} />
                <Legend />
                <Bar dataKey="Growth" name="Growth Investment" stackId="a" fill="#4ade80" />
                <Bar dataKey="Debt Repayment" name="Debt Repayment" stackId="a" fill="#60a5fa" />
                <Bar dataKey="Shareholder Returns" name="Shareholder Returns" stackId="a" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>ASML allocates the highest percentage (65%) of capital to growth investments</li>
              <li>AIXA focuses more on debt reduction compared to peers</li>
              <li>BESI and SMHN provide higher shareholder returns through dividends and buybacks</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderRiskView = () => {
    // Create data for current metrics comparison
    const currentMetricsData = selectedPeers.map(peer => ({
      name: peer,
      "Leverage Ratio": mockRiskData.leverageRatio.current[peer],
      "Probability of Default (%)": mockRiskData.probabilityOfDefault.current[peer] * 100,
      "Credit Rating": mockRiskData.creditRating[peer]
    }));

    // Create data for historical leverage ratio chart
    const leverageHistoricalData = Object.keys(mockRiskData.leverageRatio.historical).map(year => {
      const dataPoint: any = { year };
      selectedPeers.forEach(peer => {
        dataPoint[peer] = mockRiskData.leverageRatio.historical[year][peer];
      });
      return dataPoint;
    });

    // Create data for historical probability of default chart
    const defaultHistoricalData = Object.keys(mockRiskData.probabilityOfDefault.historical).map(year => {
      const dataPoint: any = { year };
      selectedPeers.forEach(peer => {
        dataPoint[peer] = mockRiskData.probabilityOfDefault.historical[year][peer] * 100;
      });
      return dataPoint;
    });

    // Create color scale for risk assessment
    const getRiskColor = (value: number, metric: 'leverage' | 'default') => {
      if (metric === 'leverage') {
        if (value < 0.2) return "#22c55e"; // Low risk - green
        if (value < 0.3) return "#eab308"; // Medium risk - yellow
        return "#ef4444"; // High risk - red
      } else { // probability of default
        if (value < 20) return "#22c55e"; // Low risk - green
        if (value < 30) return "#eab308"; // Medium risk - yellow
        return "#ef4444"; // High risk - red
      }
    };

    return (
      <div className="grid grid-cols-1 gap-6">
        {/* Current Risk Metrics Table */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Current Risk Metrics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Company</th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Leverage Ratio</th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Probability of Default</th>
                  <th className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Credit Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentMetricsData.map((peer) => (
                  <tr key={peer.name}>
                    <td className="py-2 px-3 text-sm text-gray-900 border-b">{peer.name}</td>
                    <td className="py-2 px-3 text-sm text-right border-b">
                      <span className="inline-flex items-center">
                        <span className="mr-2">{peer["Leverage Ratio"].toFixed(2)}</span>
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getRiskColor(peer["Leverage Ratio"], 'leverage') }}
                        ></span>
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm text-right border-b">
                      <span className="inline-flex items-center">
                        <span className="mr-2">{peer["Probability of Default (%)"].toFixed(1)}%</span>
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getRiskColor(peer["Probability of Default (%)"], 'default') }}
                        ></span>
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm text-center border-b">{peer["Credit Rating"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leverage Ratio Historical Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Historical Leverage Ratio</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leverageHistoricalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[0, 'auto']} />
              <Tooltip formatter={(value: any) => value.toFixed(2)} />
              <Legend />
              {selectedPeers.map((peer, index) => (
                <Line
                  key={peer}
                  type="monotone"
                  dataKey={peer}
                  name={peer}
                  stroke={`hsl(${index * 45}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Probability of Default Historical Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Historical Probability of Default (%)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={defaultHistoricalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[0, 'auto']} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: any) => `${value.toFixed(1)}%`} />
              <Legend />
              {selectedPeers.map((peer, index) => (
                <Line
                  key={peer}
                  type="monotone"
                  dataKey={peer}
                  name={peer}
                  stroke={`hsl(${index * 45}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Assessment */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Risk Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Leverage Ratio Interpretation</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm">Low Risk (&lt; 0.20)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                  <span className="text-sm">Medium Risk (0.20 - 0.30)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="text-sm">High Risk (&gt; 0.30)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Probability of Default Interpretation</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm">Low Risk (&lt; 20%)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                  <span className="text-sm">Medium Risk (20% - 30%)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="text-sm">High Risk (&gt; 30%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <StockLayout 
      symbol={mockCompanyData.symbol}
      companyName={mockCompanyData.name}
      sector="Technology"
      country="United States"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content (9 columns) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Header and Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold">Peer Comparison</h1>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={view === 'operations' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('operations')}
              >
                Operations
              </Button>
              <Button
                variant={view === 'valuation' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('valuation')}
              >
                Valuation
              </Button>
              <Button
                variant={view === 'momentum' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('momentum')}
              >
                Momentum
              </Button>
              <Button
                variant={view === 'growth' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('growth')}
              >
                Growth
              </Button>
              <Button
                variant={view === 'risk' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('risk')}
              >
                Risk
              </Button>
            </div>
          </div>

          {/* Selected Peers */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Selected Peers</h2>
              <div className="relative" ref={searchRef}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  Add Peer
                </Button>
                
                {isSearchOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border rounded-md shadow-lg z-10">
                    <div className="p-3 border-b">
                      <input
                        type="text"
                        placeholder="Search peers..."
                        className="w-full p-2 border rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredPeers.map((peer) => (
                        <div
                          key={peer.symbol}
                          className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                          onClick={() => {
                            handleAddPeer(peer.symbol as PeerSymbol);
                            setSearchTerm('');
                            setIsSearchOpen(false);
                          }}
                        >
                          <div>
                            <div>{peer.symbol}</div>
                            <div className="text-xs text-gray-500">{peer.name}</div>
                          </div>
                          {selectedPeers.includes(peer.symbol as PeerSymbol) && (
                            <span className="text-green-500">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={selectedPeers} strategy={horizontalListSortingStrategy}>
                <div className="flex flex-wrap gap-2">
                  {selectedPeers.map((peer) => (
                    <SortablePeerItem
                      key={peer}
                      peer={peer}
                      onRemove={handleRemovePeer}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Content based on selected view */}
          <div className="bg-white p-4 rounded-lg shadow">
            {view === 'operations' && renderOperationsView()}
            {view === 'valuation' && renderValuationView()}
            {view === 'momentum' && renderMomentumView()}
            {view === 'growth' && renderGrowthView()}
            {view === 'risk' && renderRiskView()}
          </div>
        </div>

        {/* Right Sidebar (3 columns) */}
        <div className="lg:col-span-3">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
            <div className="space-y-4">
              {view === 'operations' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">AROIC (Industry Average)</h4>
                    <p className="text-2xl font-bold">26.8%</p>
                    <p className="text-xs text-gray-500">vs 24.5% last year</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Asset Growth (5Y Avg)</h4>
                    <p className="text-2xl font-bold">11.2%</p>
                    <p className="text-xs text-gray-500">vs 10.3% last 5 years</p>
                  </div>
                </>
              )}
              
              {view === 'valuation' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">EV/EBITDA (Industry Average)</h4>
                    <p className="text-2xl font-bold">17.5x</p>
                    <p className="text-xs text-gray-500">vs 16.2x 5-year average</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">EV/IC (Industry Average)</h4>
                    <p className="text-2xl font-bold">21.8x</p>
                    <p className="text-xs text-gray-500">vs 19.5x 5-year average</p>
                  </div>
                </>
              )}
              
              {view === 'momentum' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">YTD Performance</h4>
                    <p className="text-2xl font-bold">+24.2%</p>
                    <p className="text-xs text-gray-500">vs +20.1% benchmark</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">3Y Annualized Return</h4>
                    <p className="text-2xl font-bold">+16.8%</p>
                    <p className="text-xs text-gray-500">vs +14.2% benchmark</p>
                  </div>
                </>
              )}
              
              {view === 'growth' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Revenue Growth (Industry Avg)</h4>
                    <p className="text-2xl font-bold">15.8%</p>
                    <p className="text-xs text-gray-500">vs 13.5% 5-year average</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Capital Allocation to Growth</h4>
                    <p className="text-2xl font-bold">52%</p>
                    <p className="text-xs text-gray-500">vs 48% industry average</p>
                  </div>
                </>
              )}
              
              {view === 'risk' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Industry Avg Leverage</h4>
                    <p className="text-2xl font-bold">0.28</p>
                    <p className="text-xs text-gray-500">vs 0.32 five years ago</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Industry Default Probability</h4>
                    <p className="text-2xl font-bold">27.5%</p>
                    <p className="text-xs text-gray-500">vs 35.2% five years ago</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow mb-6">
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
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Valuation History</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-500">Current</p>
                  <p className="font-bold">+12%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">5Y Avg</p>
                  <p className="font-bold">+3%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">10Y Avg</p>
                  <p className="font-bold">-4%</p>
                </div>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '70%' }}></div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Current valuation is in the 70th percentile of historical range
              </p>
            </div>
          </div>
        </div>
      </div>
    </StockLayout>
  );
} 