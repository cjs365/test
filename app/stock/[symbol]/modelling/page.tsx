'use client';

import { useState, useEffect } from 'react';
import StockLayout from '@/app/components/layout/StockLayout';
import { TableData, ValuationVariables, AIScenario, Scenario, SensitivityData, SensitivityPoint } from './types';
import {
  calculateTotalRevenue, 
  calculateEconomicEarnings, 
  calculateIC, 
  calculateAROIC, 
  calculateICChange, 
  calculateFCF, 
  calculateGrowthRate
} from './utils/calculations';
import { formatLargeNumber, determineUnit, formatWithCommas } from './utils/formatters';
import { fetchSensitivityData, SensitivityResult } from './services/api';
import { generateMockSensitivityData } from './services/mockData';

// Component imports
import DataTable from './components/DataTable';
import AIValuation from './components/AIValuation';
import ValuationResults from './components/ValuationResults';
import SensitivityAnalysis from './components/SensitivityAnalysis';
import { SaveScenarioModal, LoadScenarioModal, ShareScenarioModal } from './components/ScenarioManager';
import CustomLegend from './components/charts/CustomLegend';
import MetricsChart from './components/charts/MetricsChart';
import FCFChart from './components/charts/FCFChart';

// Hook imports
import { useStockValuation } from './hooks/useStockValuation';
import { useAIValuation } from './hooks/useAIValuation';
import { useValuationCalculator } from './hooks/useValuationCalculator';

export default function ModellingPage({ params }: { params: { symbol: string } }) {
  // Use the stock valuation hook
  const {
    headers,
    tableData,
    valuationVars,
    isLoading,
    error,
    refetch
  } = useStockValuation(params.symbol);
  
  // Use the AI valuation hook
  const {
    aiValuation,
    aiScenario,
    isGenerating,
    loadingMessage,
    loadingDots,
    generateValuation,
    error: aiError
  } = useAIValuation(params.symbol);
  
  // Use the valuation calculator hook
  const {
    enterpriseValue,
    equityValue,
    pricePerShare,
    upside,
    calculationSteps,
    calculateValuationResults,
    submitValuation,
    isSubmitting,
    apiResult,
    apiError
  } = useValuationCalculator(tableData, valuationVars, headers, isLoading);
  
  // Local state for UI and scenario management
  const [localValuationVars, setLocalValuationVars] = useState<ValuationVariables>(valuationVars);
  const [localTableData, setLocalTableData] = useState<TableData>(tableData);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareMessage, setShareMessage] = useState<string>('');
  const [sensitivityData, setSensitivityData] = useState<SensitivityData | null>(null);
  const [isValuationVarsExpanded, setIsValuationVarsExpanded] = useState(false);
  const [isAiValuationExpanded, setIsAiValuationExpanded] = useState(true);

  // Sync local valuation vars and table data with the ones from the hook
  useEffect(() => {
    if (!isLoading) {
      setLocalValuationVars(valuationVars);
      
      // Copy the table data
      const enhancedTableData = { ...tableData };
      
      // Debug: Log the original data from the API
      console.log('Original API data:', JSON.stringify(tableData, null, 2));
      
      // Define forecast years (last 5 years in headers)
      const forecastYears = headers.slice(-5);
      const lastHistoricalYear = headers.length >= 6 ? headers[headers.length - 6] : '';
      
      console.log('Forecast years:', forecastYears);
      console.log('Last historical year:', lastHistoricalYear);
      
      // Process revenue growth rates
      if (!enhancedTableData.revenue_gr) {
        enhancedTableData.revenue_gr = {};
        console.log('Created empty revenue_gr object');
      }
      
      // Set default growth rates for forecast years if missing
      forecastYears.forEach(year => {
        console.log(`Checking revenue_gr[${year}] = ${enhancedTableData.revenue_gr?.[year]}`);
        if (!enhancedTableData.revenue_gr[year] || enhancedTableData.revenue_gr[year] === 0) {
          // Use 3% as default growth rate if not provided by API
          enhancedTableData.revenue_gr[year] = 3.0;
          console.log(`Set default revenue_gr[${year}] = 3.0`);
        }
      });
      
      // Process earnings margins
      if (!enhancedTableData.earnings_margin) {
        enhancedTableData.earnings_margin = {};
        console.log('Created empty earnings_margin object');
      }
      
      // Use last historical year's margin as default, or 20% if not available
      const defaultMargin = lastHistoricalYear && 
                           enhancedTableData.earnings_margin && 
                           enhancedTableData.earnings_margin[lastHistoricalYear] 
                           ? enhancedTableData.earnings_margin[lastHistoricalYear] 
                           : 20.0;
      
      console.log(`Default margin: ${defaultMargin}`);
      
      // Set default margins for forecast years if missing
      forecastYears.forEach(year => {
        console.log(`Checking earnings_margin[${year}] = ${enhancedTableData.earnings_margin?.[year]}`);
        if (!enhancedTableData.earnings_margin[year] || enhancedTableData.earnings_margin[year] === 0) {
          enhancedTableData.earnings_margin[year] = defaultMargin;
          console.log(`Set default earnings_margin[${year}] = ${defaultMargin}`);
        }
      });
      
      // Process IC growth rates
      if (!enhancedTableData.ic_gr) {
        enhancedTableData.ic_gr = {};
        console.log('Created empty ic_gr object');
      }
      
      // Set default IC growth rates for forecast years if missing
      forecastYears.forEach(year => {
        console.log(`Checking ic_gr[${year}] = ${enhancedTableData.ic_gr?.[year]}`);
        if (!enhancedTableData.ic_gr[year] || enhancedTableData.ic_gr[year] === 0) {
          // Use 2% as default IC growth rate if not provided by API
          enhancedTableData.ic_gr[year] = 2.0;
          console.log(`Set default ic_gr[${year}] = 2.0`);
        }
      });
      
      // Calculate derived metrics based on the input metrics
      const derivedData = recalculateDerivedMetrics(enhancedTableData, headers);
      
      // Debug: Log the enhanced data with defaults
      console.log('Enhanced data before calculation:', JSON.stringify(enhancedTableData, null, 2));
      console.log('Derived data after calculation:', JSON.stringify(derivedData, null, 2));
      
      // Set the enhanced table data
      setLocalTableData(derivedData);
    }
  }, [valuationVars, tableData, isLoading, headers]);
  
  // Load saved scenarios from localStorage on component mount
  useEffect(() => {
    const savedScenarios = localStorage.getItem(`scenarios_${params.symbol}`);
    if (savedScenarios) {
      setScenarios(JSON.parse(savedScenarios));
    }
  }, [params.symbol]);

  // Add handler for valuation variables
  const handleValuationVarChange = (key: keyof ValuationVariables, value: string) => {
    // Allow any input, including empty string and partial numbers
    const newValue = value === '' || isNaN(Number(value)) ? 0 : Number(value);
    setLocalValuationVars(prev => ({
      ...prev,
      [key]: newValue
    }));
    
    // We need to implement proper state management for this
    // For now, we'll just trigger a recalculation
    calculateValuationResults();
  };

  // Handle input changes for the data table
  const handleInputChange = (metric: string, year: string, value: string) => {
    const yearIndex = headers.indexOf(year);
    
    // Only allow changes for last 5 years and specific metrics
    if (yearIndex < 6 || !['revenue_gr', 'earnings_margin', 'ic_gr'].includes(metric)) {
      return;
    }

    // Parse the input value
    const numValue = parseFloat(value.replace(/,/g, ''));
    if (isNaN(numValue)) return;
    
    // Update the local table data
    setLocalTableData(prev => {
      const updated = { ...prev };
      if (!updated[metric]) {
        updated[metric] = {};
      }
      updated[metric][year] = numValue;
      
      // Recalculate derived metrics
      return recalculateDerivedMetrics(updated, headers);
    });
    
    // Trigger recalculation
    calculateValuationResults();
  };

  // Function to recalculate derived metrics based on input metrics
  const recalculateDerivedMetrics = (data: TableData, years: string[]): TableData => {
    console.log('recalculateDerivedMetrics called with data:', JSON.stringify(data, null, 2));
    
    // Create a deep copy of the data to avoid mutating the original
    const calculatedData: TableData = JSON.parse(JSON.stringify(data));
    
    // Get the forecast years (last 5 years)
    const forecastYears = years.slice(-5);
    const lastHistoricalYear = years.length >= 6 ? years[years.length - 6] : '';
    
    console.log('recalculateDerivedMetrics - forecast years:', forecastYears);
    console.log('recalculateDerivedMetrics - last historical year:', lastHistoricalYear);
    
    // Debug the input metrics
    console.log('Input metrics for forecast years:');
    forecastYears.forEach(year => {
      console.log(`Year ${year}:`);
      console.log(`  revenue_gr: ${calculatedData.revenue_gr?.[year]}`);
      console.log(`  earnings_margin: ${calculatedData.earnings_margin?.[year]}`);
      console.log(`  ic_gr: ${calculatedData.ic_gr?.[year]}`);
    });
    
    if (lastHistoricalYear) {
      // Ensure all required objects exist
      if (!calculatedData.total_revenue) calculatedData.total_revenue = {};
      if (!calculatedData.economic_earnings) calculatedData.economic_earnings = {};
      if (!calculatedData.ic) calculatedData.ic = {};
      if (!calculatedData.ic_change) calculatedData.ic_change = {};
      if (!calculatedData.aroic) calculatedData.aroic = {};
      if (!calculatedData.fcf) calculatedData.fcf = {};
      if (!calculatedData.fcf_gr) calculatedData.fcf_gr = {};
      
      // Process each forecast year
      forecastYears.forEach((year, index) => {
        // Get the previous year
        const prevYear = index === 0 ? lastHistoricalYear : forecastYears[index - 1];
        
        console.log(`Processing year ${year} (prev: ${prevYear}):`);
        
        // Calculate total revenue
        if (calculatedData.revenue_gr && calculatedData.revenue_gr[year] && 
            calculatedData.total_revenue && calculatedData.total_revenue[prevYear]) {
          const prevRevenue = calculatedData.total_revenue[prevYear];
          const growthRate = calculatedData.revenue_gr[year];
          calculatedData.total_revenue[year] = calculateTotalRevenue(prevRevenue, growthRate);
          console.log(`  total_revenue: ${prevRevenue} * (1 + ${growthRate}/100) = ${calculatedData.total_revenue[year]}`);
        } else {
          console.log(`  Cannot calculate total_revenue: missing data`);
          console.log(`    revenue_gr[${year}]: ${calculatedData.revenue_gr?.[year]}`);
          console.log(`    total_revenue[${prevYear}]: ${calculatedData.total_revenue?.[prevYear]}`);
        }
        
        // Calculate economic earnings
        if (calculatedData.total_revenue && calculatedData.total_revenue[year] && 
            calculatedData.earnings_margin && calculatedData.earnings_margin[year]) {
          const revenue = calculatedData.total_revenue[year];
          const margin = calculatedData.earnings_margin[year];
          calculatedData.economic_earnings[year] = calculateEconomicEarnings(revenue, margin);
          console.log(`  economic_earnings: ${revenue} * (${margin}/100) = ${calculatedData.economic_earnings[year]}`);
        } else {
          console.log(`  Cannot calculate economic_earnings: missing data`);
          console.log(`    total_revenue[${year}]: ${calculatedData.total_revenue?.[year]}`);
          console.log(`    earnings_margin[${year}]: ${calculatedData.earnings_margin?.[year]}`);
        }
        
        // Calculate invested capital
        if (calculatedData.ic_gr && calculatedData.ic_gr[year] && 
            calculatedData.ic && calculatedData.ic[prevYear]) {
          const prevIC = calculatedData.ic[prevYear];
          const growthRate = calculatedData.ic_gr[year];
          calculatedData.ic[year] = calculateIC(prevIC, growthRate);
          console.log(`  ic: ${prevIC} * (1 + ${growthRate}/100) = ${calculatedData.ic[year]}`);
        } else {
          console.log(`  Cannot calculate ic: missing data`);
          console.log(`    ic_gr[${year}]: ${calculatedData.ic_gr?.[year]}`);
          console.log(`    ic[${prevYear}]: ${calculatedData.ic?.[prevYear]}`);
        }
        
        // Calculate IC change
        if (calculatedData.ic && calculatedData.ic[year] && 
            calculatedData.ic[prevYear]) {
          const currentIC = calculatedData.ic[year];
          const prevIC = calculatedData.ic[prevYear];
          calculatedData.ic_change[year] = calculateICChange(currentIC, prevIC);
          console.log(`  ic_change: ${currentIC} - ${prevIC} = ${calculatedData.ic_change[year]}`);
        } else {
          console.log(`  Cannot calculate ic_change: missing data`);
          console.log(`    ic[${year}]: ${calculatedData.ic?.[year]}`);
          console.log(`    ic[${prevYear}]: ${calculatedData.ic?.[prevYear]}`);
        }
        
        // Calculate AROIC
        if (calculatedData.economic_earnings && calculatedData.economic_earnings[year] && 
            calculatedData.ic && calculatedData.ic[year]) {
          const earnings = calculatedData.economic_earnings[year];
          const ic = calculatedData.ic[year];
          calculatedData.aroic[year] = calculateAROIC(earnings, ic);
          console.log(`  aroic: (${earnings} / ${ic}) * 100 = ${calculatedData.aroic[year]}`);
        } else {
          console.log(`  Cannot calculate aroic: missing data`);
          console.log(`    economic_earnings[${year}]: ${calculatedData.economic_earnings?.[year]}`);
          console.log(`    ic[${year}]: ${calculatedData.ic?.[year]}`);
        }
        
        // Calculate FCF
        if (calculatedData.economic_earnings && calculatedData.economic_earnings[year] && 
            calculatedData.ic_change && calculatedData.ic_change[year]) {
          const earnings = calculatedData.economic_earnings[year];
          const icChange = calculatedData.ic_change[year];
          calculatedData.fcf[year] = calculateFCF(earnings, icChange);
          console.log(`  fcf: ${earnings} - ${icChange} = ${calculatedData.fcf[year]}`);
        } else {
          console.log(`  Cannot calculate fcf: missing data`);
          console.log(`    economic_earnings[${year}]: ${calculatedData.economic_earnings?.[year]}`);
          console.log(`    ic_change[${year}]: ${calculatedData.ic_change?.[year]}`);
        }
        
        // Calculate FCF growth rate
        if (calculatedData.fcf && calculatedData.fcf[year] && 
            calculatedData.fcf[prevYear]) {
          const currentFCF = calculatedData.fcf[year];
          const prevFCF = calculatedData.fcf[prevYear];
          calculatedData.fcf_gr[year] = calculateGrowthRate(currentFCF, prevFCF);
          console.log(`  fcf_gr: ((${currentFCF} - ${prevFCF}) / |${prevFCF}|) * 100 = ${calculatedData.fcf_gr[year]}`);
        } else {
          console.log(`  Cannot calculate fcf_gr: missing data`);
          console.log(`    fcf[${year}]: ${calculatedData.fcf?.[year]}`);
          console.log(`    fcf[${prevYear}]: ${calculatedData.fcf?.[prevYear]}`);
        }
      });
    }
    
    // Log the final calculated values for the forecast metrics
    console.log('Final calculated values for forecast years:');
    forecastYears.forEach(year => {
      console.log(`Year ${year}:`);
      console.log(`  revenue_gr: ${calculatedData.revenue_gr?.[year]}`);
      console.log(`  earnings_margin: ${calculatedData.earnings_margin?.[year]}`);
      console.log(`  ic_gr: ${calculatedData.ic_gr?.[year]}`);
    });
    
    return calculatedData;
  };

  // Scenario management functions
  const handleSaveScenario = (name: string, description: string) => {
    const newScenario: Scenario = {
      name,
      description,
      data: tableData,
      valuationVars: localValuationVars,
      createdAt: new Date().toISOString()
    };
    
    const updatedScenarios = [...scenarios, newScenario];
    setScenarios(updatedScenarios);
    localStorage.setItem(`scenarios_${params.symbol}`, JSON.stringify(updatedScenarios));
    
    setShowSaveModal(false);
  };

  const handleLoadScenario = (scenario: Scenario) => {
    // This would need to be updated to work with our new hooks
    console.log('Loading scenario:', scenario.name);
    setShowLoadModal(false);
  };

  const handleDeleteScenario = (index: number) => {
    const updatedScenarios = [...scenarios];
    updatedScenarios.splice(index, 1);
    setScenarios(updatedScenarios);
    localStorage.setItem(`scenarios_${params.symbol}`, JSON.stringify(updatedScenarios));
  };

  const handleShareScenario = (scenario: Scenario) => {
    // Create a shareable object with scenario data
    const shareableData = {
      symbol: params.symbol,
      scenario: scenario
    };
    
    // Convert to base64 for URL sharing
    const encodedData = btoa(JSON.stringify(shareableData));
    const link = `${window.location.origin}/stock/${params.symbol}/modelling?scenario=${encodedData}`;
    
    setShareLink(link);
    setShareMessage(`Check out my ${params.symbol} valuation scenario!`);
    setShowShareModal(true);
  };

  const handleShareCurrentScenario = () => {
    // Create a shareable object with current scenario data
    const currentScenario: Scenario = {
      name: "Current Scenario",
      data: tableData,
      valuationVars: localValuationVars,
      createdAt: new Date().toISOString()
    };
    handleShareScenario(currentScenario);
  };

  const handleShareMessageChange = (message: string) => {
    setShareMessage(message);
  };

    // Sensitivity matrix generation function using API
  const generateSensitivityMatrix = async () => {
    try {
      // Show loading state
      console.log('Generating sensitivity matrix...');
      
      try {
        // Call the API to get sensitivity data
        const result = await fetchSensitivityData(params.symbol, localTableData, localValuationVars);
        
        if (result && result.status === 'success' && result.matrix) {
          processSensitivityMatrix(result);
        } else {
          console.error('Invalid response format:', result);
          alert('Failed to generate sensitivity matrix. Invalid response format.');
        }
      } catch (apiError) {
        console.error('API error, using mock sensitivity data:', apiError);
        
        // Generate mock sensitivity data
        const mockResult = generateMockSensitivityData();
        processSensitivityMatrix(mockResult);
      }
    } catch (error) {
      console.error('Error generating sensitivity matrix:', error);
      // Show error message to user
      alert('Failed to generate sensitivity matrix. Please try again.');
    }
  };
  
  // Helper function to process sensitivity matrix data
  const processSensitivityMatrix = (result: SensitivityResult) => {
    try {
      // Parse the matrix string into a JSON object
      const matrixData = JSON.parse(result.matrix);
      console.log('Parsed matrix data:', matrixData);
      
      // Extract unique revenue growth rates and IC growth rates
      const uniqueRevenueGr = new Set<number>();
      const uniqueIcGr = new Set<number>();
      
      // Collect all unique values from the parsed matrix
      Object.values(matrixData).forEach((item: any) => {
        if (item.revenue_gr !== undefined) uniqueRevenueGr.add(item.revenue_gr);
        if (item.ic_gr !== undefined) uniqueIcGr.add(item.ic_gr);
      });
      
      // Convert to sorted arrays
      const growth = Array.from(uniqueRevenueGr).sort((a, b) => a - b);
      const margins = Array.from(uniqueIcGr).sort((a, b) => a - b);
      
      console.log('Unique growth rates:', growth);
      console.log('Unique IC growth rates (margins):', margins);
      
      // Create matrix structure
      const matrix: number[][] = [];
      
      // Fill matrix with potential upside values
      for (let i = 0; i < growth.length; i++) {
        matrix[i] = [];
        for (let j = 0; j < margins.length; j++) {
          // Find the corresponding data point in the parsed matrix
          const dataPoint = Object.values(matrixData).find(
            (item: any) => 
              item.revenue_gr === growth[i] && item.ic_gr === margins[j]
          ) as { revenue_gr: number; ic_gr: number; potential_upside: number } | undefined;
          
          matrix[i][j] = dataPoint && typeof dataPoint.potential_upside === 'number'
            ? dataPoint.potential_upside 
            : 0;
        }
      }
      
      console.log('Generated matrix:', matrix);
      
      // Generate chart data for visualization
      const chartData = growth.map((g, i) => ({
        growth: g,
        ...Object.fromEntries(margins.map((m, j) => [`margin${j}`, matrix[i][j]]))
      }));
      
      console.log('Generated chart data:', chartData);
      
      // Update state with the new sensitivity data
      setSensitivityData({ growth, margins, matrix, chartData });
    } catch (error) {
      console.error('Error processing sensitivity matrix:', error);
      alert('Failed to process sensitivity matrix data.');
    }
  };

  const resetData = () => {
    // Reset local valuation vars to the original data from the hook
    setLocalValuationVars(valuationVars);
    
    // Copy the table data and ensure forecast metrics have default values
    const enhancedTableData = { ...tableData };
    
    // Define forecast years (last 5 years in headers)
    const forecastYears = headers.slice(-5);
    const lastHistoricalYear = headers.length >= 6 ? headers[headers.length - 6] : '';
    
    // Ensure revenue_gr has values
    if (!enhancedTableData.revenue_gr) {
      enhancedTableData.revenue_gr = {};
    }
    
    // Set default growth rates if they're missing (3% growth)
    forecastYears.forEach(year => {
      if (!enhancedTableData.revenue_gr[year] || enhancedTableData.revenue_gr[year] === 0) {
        enhancedTableData.revenue_gr[year] = 3.0;
      }
    });
    
    // Ensure earnings_margin has values
    if (!enhancedTableData.earnings_margin) {
      enhancedTableData.earnings_margin = {};
    }
    
    // Set default margins if they're missing (use last historical year or 20%)
    const defaultMargin = lastHistoricalYear && 
                         enhancedTableData.earnings_margin && 
                         enhancedTableData.earnings_margin[lastHistoricalYear] 
                         ? enhancedTableData.earnings_margin[lastHistoricalYear] 
                         : 20.0;
    
    forecastYears.forEach(year => {
      if (!enhancedTableData.earnings_margin[year] || enhancedTableData.earnings_margin[year] === 0) {
        enhancedTableData.earnings_margin[year] = defaultMargin;
      }
    });
    
    // Ensure ic_gr has values
    if (!enhancedTableData.ic_gr) {
      enhancedTableData.ic_gr = {};
    }
    
    // Set default IC growth rates if they're missing (2% growth)
    forecastYears.forEach(year => {
      if (!enhancedTableData.ic_gr[year] || enhancedTableData.ic_gr[year] === 0) {
        enhancedTableData.ic_gr[year] = 2.0;
      }
    });
    
    // Recalculate derived metrics based on the input metrics
    const calculatedData = recalculateDerivedMetrics(enhancedTableData, headers);
    
    setLocalTableData(calculatedData);
    
    // Recalculate valuation results
    calculateValuationResults();
  };

  const handleApplyAIScenario = () => {
    if (!aiScenario) return;
    
    // Create a new tableData object with the AI scenario values
    const updatedTableData = { ...localTableData };
    
    // Update revenue growth rates
    if (!updatedTableData.revenue_gr) {
      updatedTableData.revenue_gr = {};
    }
    Object.entries(aiScenario.revenue_gr).forEach(([year, value]) => {
      updatedTableData.revenue_gr[year] = value;
    });
    
    // Update earnings margins
    if (!updatedTableData.earnings_margin) {
      updatedTableData.earnings_margin = {};
    }
    Object.entries(aiScenario.earnings_margin).forEach(([year, value]) => {
      updatedTableData.earnings_margin[year] = value;
    });
    
    // Update investment capital growth rates
    if (!updatedTableData.ic_gr) {
      updatedTableData.ic_gr = {};
    }
    Object.entries(aiScenario.ic_gr).forEach(([year, value]) => {
      updatedTableData.ic_gr[year] = value;
    });
    
    // Recalculate derived metrics based on the input metrics
    const calculatedData = recalculateDerivedMetrics(updatedTableData, headers);
    
    // Update the local table data state
    setLocalTableData(calculatedData);
    
    // Recalculate valuation results
    calculateValuationResults();
  };

  const handleSubmit = async () => {
    // Submit valuation data to the API
    try {
      console.log('Submitting valuation with localTableData:', localTableData);
      console.log('Submitting valuation with localValuationVars:', localValuationVars);
      
      // First, ensure we calculate the valuation locally to show immediate results
      calculateValuationResults();
      
      // Then call the API for more accurate results
      const result = await submitValuation(params.symbol, localTableData, localValuationVars);
      
      if (result) {
        console.log('Valuation result:', result);
        // The hook will update the state with the result
      }
    } catch (error) {
      console.error('Error submitting valuation:', error);
      // Even if the API call fails, we still have local calculation results to show
    }
  };

  return (
    <StockLayout symbol={params.symbol} companyName="Apple Inc." sector="Technology" country="United States">
      <div className="bg-white min-h-screen">
        <div className="grid grid-cols-12 gap-0">
          {/* Left Column - Assumptions and Variables */}
          <div className="col-span-8 border-r">
            {/* Valuation Assumptions */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium text-gray-900">Valuation Assumptions</h3>
                <div className="flex items-center space-x-2">
                  {/* Updated button layout to match the image */}
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save
                  </button>
                  <button
                    onClick={() => setShowLoadModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Load
                  </button>
                  <button
                    onClick={handleShareCurrentScenario}
                    className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                  {aiValuation && (
                    <button
                      onClick={() => setIsAiValuationExpanded(!isAiValuationExpanded)}
                      className="inline-flex items-center px-2 py-2 text-gray-700 hover:text-gray-900 bg-transparent transition-colors"
                      aria-label={isAiValuationExpanded ? "Hide AI Analysis" : "Show AI Analysis"}
                    >
                      <svg
                        className={`w-5 h-5 transform transition-transform ${isAiValuationExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={generateValuation}
                    disabled={isGenerating}
                    className="inline-flex items-center px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-medium rounded-md transition-all duration-200 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {loadingMessage}{loadingDots}
                      </>
                    ) : (
                      <>Generate AI Valuation</>
                    )}
                  </button>
                </div>
              </div>

              {/* Mock Data Indicator */}
              {error && error.includes('API Error') && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-600">Using mock data for demonstration. All features are functional with sample data.</p>
                  </div>
                </div>
              )}

              {/* AI Error Display */}
              {aiError && !aiError.includes('Using mock data') && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{aiError}</p>
                </div>
              )}

              {aiValuation && aiScenario && isAiValuationExpanded && (
                <div className="mb-6">
                  <div className="rounded-lg bg-gray-50 p-4">
                    {/* AI Scenario Data Table */}
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold mb-2">AI Scenario Assumptions</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Metric</th>
                              {Object.keys(aiScenario.revenue_gr).map(year => (
                                <th key={year} className="px-2 py-1 text-left text-xs font-medium text-gray-500">{year}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-2 py-1 text-xs font-medium">Revenue Gr (%)</td>
                              {Object.entries(aiScenario.revenue_gr).map(([year, value]) => (
                                <td key={year} className="px-2 py-1 text-xs text-blue-600">{value.toFixed(1)}</td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-2 py-1 text-xs font-medium">Earnings Margin (%)</td>
                              {Object.entries(aiScenario.earnings_margin).map(([year, value]) => (
                                <td key={year} className="px-2 py-1 text-xs text-blue-600">{value.toFixed(1)}</td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-2 py-1 text-xs font-medium">IC Growth (%)</td>
                              {Object.entries(aiScenario.ic_gr).map(([year, value]) => (
                                <td key={year} className="px-2 py-1 text-xs text-blue-600">{value.toFixed(1)}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3 flex justify-end space-x-2">
                        <button
                          onClick={resetData}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          Reset to Default
                        </button>
                        <button
                          onClick={handleApplyAIScenario}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                          Apply Scenario
                        </button>
                      </div>
                    </div>

                    {/* Existing AI Valuation Content */}
                    {aiValuation.split('\n').map((line, index) => (
                      <div key={index} className="markdown-line">
                        {line.startsWith('###') ? (
                          <h3 className="text-sm font-semibold mt-3 mb-2">{line.replace('### ', '')}</h3>
                        ) : line.startsWith('##') ? (
                          <h2 className="text-base font-semibold mb-3">{line.replace('## ', '')}</h2>
                        ) : line.startsWith('-') ? (
                          <p className="text-sm text-gray-600 ml-4 my-1">• {line.replace('- ', '')}</p>
                        ) : line.startsWith('  •') ? (
                          <p className="text-sm text-gray-600 ml-8 my-1">{line}</p>
                        ) : (
                          <p className="text-sm text-gray-600 my-1">{line}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Financial Data</h3>
                </div>
                
                {isLoading ? (
                  <div className="p-6 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="mt-2">Loading financial data...</p>
                  </div>
                ) : error && !error.includes('API Error') ? (
                  <div className="p-6 text-center text-red-500">
                    <p>Error loading data: {error}</p>
                  </div>
                ) : (
                  <DataTable 
                    tableData={localTableData} 
                    headers={headers} 
                    handleInputChange={handleInputChange} 
                  />
                )}
              </div>

              {/* Collapsible Valuation Variables Table */}
              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => setIsValuationVarsExpanded(!isValuationVarsExpanded)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <h4 className="text-sm font-medium text-gray-900">Valuation Variables</h4>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${isValuationVarsExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isValuationVarsExpanded && (
                  <div className="mt-3 grid grid-cols-3 gap-4">
                    {Object.entries(localValuationVars).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{key}</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={value.toString()}
                          onChange={(e) => handleValuationVarChange(key as keyof ValuationVariables, e.target.value)}
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-6 py-4 border-b flex justify-end space-x-3">
              <button
                onClick={resetData}
                className="inline-flex justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  handleSubmit();
                }}
                disabled={isSubmitting || isLoading}
                className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Calculating...
                  </>
                ) : 'Calculate Valuation'}
              </button>
            </div>
            
            {/* API Error Message */}
            {apiError && !apiError.includes('Using mock data') && (
              <div className="px-6 py-4 text-center">
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700">Error: {apiError}</p>
                </div>
              </div>
            )}
            
            {/* Valuation Results - Two Column Layout */}
            {(calculationSteps.length > 0 || enterpriseValue !== null) && (
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Valuation Results</h3>
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Calculation Details */}
                  <div className="bg-white shadow-sm">
                    <div className="p-4 border-b">
                      <h4 className="text-base font-medium text-gray-900">Calculation Details</h4>
                    </div>
                    <div className="p-4">
                      {calculationSteps.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Label</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Value</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Calculation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {calculationSteps.map((step, index) => (
                                <tr key={index} className={`${index < calculationSteps.length - 1 ? 'border-b' : ''} ${index === calculationSteps.length - 1 ? 'bg-blue-50' : ''}`}>
                                  <td className="px-3 py-2 text-xs">{step.label}</td>
                                  <td className="px-3 py-2 text-xs text-right font-medium">
                                    {step.value.includes('$') ? 
                                      `$${formatWithCommas(step.value.replace('$', ''))}` : 
                                      formatWithCommas(step.value)}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-gray-500">{step.calculation}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          <p>Calculation details will appear here after processing.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Column - Valuation Results Summary */}
                  <div className="bg-white shadow-sm">
                    <div className="p-4 border-b">
                      <h4 className="text-base font-medium text-gray-900">Summary</h4>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b">
                          <span className="text-sm text-gray-600">Enterprise Value</span>
                          <span className={`text-sm font-medium ${!!apiResult ? 'text-blue-600' : ''}`}>
                            {enterpriseValue ? formatLargeNumber(enterpriseValue).formatted : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Equity Value</span>
                          <span className="text-sm font-medium">{equityValue ? formatLargeNumber(equityValue).formatted : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Price per Share</span>
                          <span className="text-sm font-medium">{pricePerShare ? `$${formatWithCommas(pricePerShare)}` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm text-gray-600">Upside/Downside</span>
                          <div className={`px-3 py-1 rounded text-white font-medium ${Number(upside) >= 0 ? 'bg-green-500' : 'bg-red-500'} ${!!apiResult ? 'ring-2 ring-blue-300' : ''}`}>
                            {Number(upside) >= 0 ? '+' : ''}{formatWithCommas(upside)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Charts */}
          <div className="col-span-4 p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Key Metrics</h3>
                <CustomLegend />
              </div>
              
              {/* Charts */}
              <div className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="p-6 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="mt-2">Loading chart data...</p>
                  </div>
                ) : error && !error.includes('API Error') ? (
                  <div className="p-6 text-center text-red-500">
                    <p>Error loading data: {error}</p>
                  </div>
                ) : (
                  <div className="p-6">
                    {/* 2x2 Grid for first 4 charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <MetricsChart 
                        title="Revenue Growth (%)"
                        data={headers.map((year, index) => ({
                          year,
                          value: localTableData.revenue_gr?.[year],
                          isForecast: index >= 6
                        }))}
                      />
                      <MetricsChart 
                        title="Earnings Margin (%)"
                        data={headers.map((year, index) => ({
                          year,
                          value: localTableData.earnings_margin?.[year],
                          isForecast: index >= 6
                        }))}
                      />
                      <MetricsChart 
                        title="IC Growth (%)"
                        data={headers.map((year, index) => ({
                          year,
                          value: localTableData.ic_gr?.[year],
                          isForecast: index >= 6
                        }))}
                      />
                      <MetricsChart 
                        title="AROIC (%)"
                        data={headers.map((year, index) => ({
                          year,
                          value: localTableData.aroic?.[year],
                          isForecast: index >= 6
                        }))}
                      />
                    </div>
                    
                    {/* Full-width FCF Chart */}
                    <div className="mt-6">
                      <FCFChart 
                        title="Free Cash Flow"
                        data={headers.map((year, index) => ({
                          year,
                          value: localTableData.fcf?.[year],
                          isForecast: index >= 6
                        }))}
                        preferredUnit={determineUnit(localTableData.fcf ? Object.values(localTableData.fcf) : [])}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sensitivity Analysis */}
              <SensitivityAnalysis 
                sensitivityData={sensitivityData}
                generateSensitivityMatrix={generateSensitivityMatrix}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SaveScenarioModal 
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveScenario}
      />

      <LoadScenarioModal 
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        scenarios={scenarios}
        onLoad={handleLoadScenario}
        onDelete={handleDeleteScenario}
        onShare={handleShareScenario}
      />

      <ShareScenarioModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareLink={shareLink}
        shareMessage={shareMessage}
        onShareMessageChange={handleShareMessageChange}
      />
    </StockLayout>
  );
} 
