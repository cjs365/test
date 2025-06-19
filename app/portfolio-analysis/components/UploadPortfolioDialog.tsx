import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger, DialogClose 
} from '@/app/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Upload, ArrowRight, Check, AlertCircle, X, Edit2, HelpCircle } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Type for ticker status
type TickerStatus = 'valid' | 'ambiguous' | 'invalid';

// Type for parsed ticker data
interface ParsedTicker {
  ticker: string;
  weight: number | null;
  status: TickerStatus;
  matches?: string[];
  name?: string;
  country?: string;
}

// Mock function for ticker validation (would connect to backend in real app)
const validateTickers = (tickers: string[]): Promise<ParsedTicker[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const results: ParsedTicker[] = tickers.map(ticker => {
        // Mock validation logic - in production this would call a backend service
        const tickerUpper = ticker.toUpperCase();
        
        if (['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA'].includes(tickerUpper)) {
          // Known valid tickers
          const tickerInfo: Record<string, { name: string, country: string }> = {
            'AAPL': { name: 'Apple Inc.', country: 'US' },
            'MSFT': { name: 'Microsoft Corporation', country: 'US' },
            'GOOGL': { name: 'Alphabet Inc.', country: 'US' },
            'AMZN': { name: 'Amazon.com Inc.', country: 'US' },
            'META': { name: 'Meta Platforms Inc.', country: 'US' },
            'TSLA': { name: 'Tesla Inc.', country: 'US' }
          };
          
          return {
            ticker: tickerUpper,
            weight: null,
            status: 'valid',
            name: tickerInfo[tickerUpper].name,
            country: tickerInfo[tickerUpper].country
          };
        } else if (['A', 'C', 'F', 'T'].includes(tickerUpper)) {
          // Ambiguous tickers with multiple matches
          const ambiguousMatches: Record<string, string[]> = {
            'A': ['A:US - Agilent Technologies', 'A:AU - Austal Limited', 'A:CN - Aimia Inc.'],
            'C': ['C:US - Citigroup Inc.', 'C:CN - Canaccord Genuity Group'],
            'F': ['F:US - Ford Motor Company', 'F:CA - Fairfax Financial'],
            'T': ['T:US - AT&T Inc.', 'T:CA - TELUS Corporation']
          };
          
          return {
            ticker: tickerUpper,
            weight: null,
            status: 'ambiguous',
            matches: ambiguousMatches[tickerUpper]
          };
        } else {
          // Invalid/unknown ticker
          return {
            ticker: tickerUpper,
            weight: null,
            status: 'invalid'
          };
        }
      });
      
      resolve(results);
    }, 500);
  });
};

// Function to detect delimiter in input text
const detectDelimiter = (text: string): string => {
  const delimiters = [',', '\t', ' '];
  const counts = delimiters.map(d => (text.match(new RegExp(d, 'g')) || []).length);
  const maxIndex = counts.indexOf(Math.max(...counts));
  return delimiters[maxIndex];
};

// Function to parse input text into ticker and weight pairs
const parseInput = (input: string): { ticker: string, weight: number | null }[] => {
  if (!input.trim()) return [];
  
  const lines = input.trim().split(/[\r\n]+/);
  const results: { ticker: string, weight: number | null }[] = [];
  
  lines.forEach(line => {
    // Skip empty lines
    if (!line.trim()) return;
    
    // Detect the delimiter for this line
    const delimiter = detectDelimiter(line);
    const parts = line.split(delimiter).map(part => part.trim()).filter(Boolean);
    
    if (parts.length > 0) {
      const ticker = parts[0];
      let weight: number | null = null;
      
      // Try to parse weight if available
      if (parts.length > 1) {
        const parsedWeight = parseFloat(parts[1]);
        if (!isNaN(parsedWeight)) {
          weight = parsedWeight;
        }
      }
      
      results.push({ ticker, weight });
    }
  });
  
  return results;
};

// Function to auto-normalize weights
const normalizeWeights = (tickers: ParsedTicker[]): ParsedTicker[] => {
  // Check if we need to auto-generate weights
  const hasWeights = tickers.some(t => t.weight !== null);
  
  // If no weights are provided, distribute evenly
  if (!hasWeights) {
    const weight = 1 / tickers.length;
    return tickers.map(t => ({
      ...t,
      weight: parseFloat((weight * 100).toFixed(2))
    }));
  }
  
  // If some weights are missing, distribute remaining weight
  const tickersWithWeights = tickers.filter(t => t.weight !== null);
  const sumOfWeights = tickersWithWeights.reduce((sum, t) => sum + (t.weight || 0), 0);
  
  // If weights sum to approximately 1 (or 100), assume they're already normalized
  if (Math.abs(sumOfWeights - 1) < 0.01 || Math.abs(sumOfWeights - 100) < 1) {
    // Convert to percentage if in decimal form
    if (Math.abs(sumOfWeights - 1) < 0.01) {
      return tickers.map(t => ({
        ...t,
        weight: t.weight !== null ? parseFloat((t.weight * 100).toFixed(2)) : null
      }));
    }
    return tickers;
  }
  
  // Otherwise normalize to 100%
  const normalizationFactor = 100 / sumOfWeights;
  return tickers.map(t => ({
    ...t,
    weight: t.weight !== null ? parseFloat((t.weight * normalizationFactor).toFixed(2)) : null
  }));
};

// Steps in the upload workflow
type UploadStep = 'paste' | 'review' | 'confirm';

export interface UploadPortfolioDialogProps {
  onSubmit: (portfolioName: string, tickers: ParsedTicker[]) => void;
}

export default function UploadPortfolioDialog({ onSubmit }: UploadPortfolioDialogProps) {
  // Dialog state
  const [open, setOpen] = useState(false);
  
  // Step state
  const [currentStep, setCurrentStep] = useState<UploadStep>('paste');
  
  // Form state
  const [portfolioName, setPortfolioName] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [parsedTickers, setParsedTickers] = useState<ParsedTicker[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Reset state when dialog closes
  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setCurrentStep('paste');
    setPortfolioName('');
    setRawInput('');
    setParsedTickers([]);
    setError('');
  };
  
  // Sample data handler
  const insertSampleData = () => {
    setRawInput('AAPL 25.5\nMSFT 30\nGOOGL 15\nAMZN 20\nT 9.5');
  };
  
  // Handle form next step
  const handleNext = async () => {
    setError('');
    
    if (currentStep === 'paste') {
      // Validate inputs for paste step
      if (!portfolioName.trim()) {
        setError('Please enter a portfolio name');
        return;
      }
      
      if (!rawInput.trim()) {
        setError('Please enter ticker symbols');
        return;
      }
      
      // Parse the input
      setIsProcessing(true);
      try {
        const parsed = parseInput(rawInput);
        if (parsed.length === 0) {
          setError('No valid ticker symbols detected');
          setIsProcessing(false);
          return;
        }
        
        // Validate tickers with simulated backend call
        const validatedTickers = await validateTickers(parsed.map(p => p.ticker));
        
        // Merge weight information
        const tickersWithWeights = validatedTickers.map((t, index) => ({
          ...t,
          weight: parsed[index].weight
        }));
        
        setParsedTickers(tickersWithWeights);
        setCurrentStep('review');
      } catch (err) {
        setError('Failed to process tickers. Please check your input format.');
      }
      setIsProcessing(false);
    } 
    else if (currentStep === 'review') {
      // Move to confirmation step with normalized weights
      const normalizedTickers = normalizeWeights(parsedTickers);
      setParsedTickers(normalizedTickers);
      setCurrentStep('confirm');
    } 
    else if (currentStep === 'confirm') {
      // Submit the portfolio
      onSubmit(portfolioName, parsedTickers);
      setOpen(false);
      resetForm();
    }
  };
  
  // Handle ticker resolution for ambiguous tickers
  const resolveAmbiguousTicker = (index: number, resolvedTicker: string) => {
    const updatedTickers = [...parsedTickers];
    
    // Extract ticker code from the selection (e.g., "A:US - Agilent Technologies" -> "A:US")
    const tickerCode = resolvedTicker.split(' - ')[0];
    
    updatedTickers[index] = {
      ...updatedTickers[index],
      ticker: tickerCode,
      status: 'valid',
      name: resolvedTicker.split(' - ')[1],
      country: tickerCode.split(':')[1]
    };
    
    setParsedTickers(updatedTickers);
  };
  
  // Handle weight update
  const updateWeight = (index: number, weight: string) => {
    const parsed = parseFloat(weight);
    if (isNaN(parsed)) return;
    
    const updatedTickers = [...parsedTickers];
    updatedTickers[index] = {
      ...updatedTickers[index],
      weight: parsed
    };
    
    setParsedTickers(updatedTickers);
  };
  
  // Handle ticker removal
  const removeTicker = (index: number) => {
    const updatedTickers = parsedTickers.filter((_, i) => i !== index);
    setParsedTickers(updatedTickers);
  };
  
  // Calculate totals for the confirmation table
  const totalWeight = parsedTickers.reduce((sum, ticker) => sum + (ticker.weight || 0), 0);
  const validTickerCount = parsedTickers.filter(t => t.status === 'valid').length;
  
  // Handle back button
  const handleBack = () => {
    if (currentStep === 'review') {
      setCurrentStep('paste');
    } else if (currentStep === 'confirm') {
      setCurrentStep('review');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 text-xs">
          <Upload className="h-3 w-3 mr-1" />
          Upload Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Portfolio</DialogTitle>
          <DialogDescription>
            {currentStep === 'paste' && "Paste a list of ticker symbols with optional weights"}
            {currentStep === 'review' && "Review and resolve any issues with your portfolio"}
            {currentStep === 'confirm' && "Confirm your portfolio details"}
          </DialogDescription>
        </DialogHeader>
        
        {/* Step indicator */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center space-x-1">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
              currentStep === 'paste' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              1
            </div>
            <div className="h-0.5 w-6 bg-muted"></div>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
              currentStep === 'review' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              2
            </div>
            <div className="h-0.5 w-6 bg-muted"></div>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
              currentStep === 'confirm' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              3
            </div>
          </div>
        </div>
        
        {/* Error message display */}
        {error && (
          <div className="bg-destructive/20 text-destructive text-sm p-2 rounded flex items-start mb-4">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Step 1: Paste Input */}
        {currentStep === 'paste' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="portfolio-name" className="text-right">Portfolio Name</Label>
              <Input
                id="portfolio-name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="My Portfolio"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-right pt-2 flex flex-col items-end">
                <Label htmlFor="ticker-input" className="mb-1">Tickers & Weights</Label>
                <button 
                  onClick={insertSampleData} 
                  className="text-xs text-primary hover:underline"
                  type="button"
                >
                  Insert sample
                </button>
              </div>
              <div className="col-span-3">
                <Textarea 
                  id="ticker-input"
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="AAPL 0.25&#10;MSFT 0.30&#10;GOOGL 0.15&#10;AMZN 0.20&#10;META 0.10"
                  className="min-h-[120px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter one ticker per line. Optionally include weights separated by space, tab, or comma.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Review and Resolve Issues */}
        {currentStep === 'review' && (
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Review Tickers</h3>
              <span className="text-xs text-muted-foreground">
                {parsedTickers.length} ticker{parsedTickers.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {parsedTickers.map((ticker, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-2 rounded border",
                  ticker.status === 'valid' ? "border-green-500/20 bg-green-500/10" :
                  ticker.status === 'ambiguous' ? "border-yellow-500/20 bg-yellow-500/10" :
                  "border-red-500/20 bg-red-500/10"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {ticker.status === 'valid' && <Check className="h-4 w-4 text-green-500 mr-2" />}
                    {ticker.status === 'ambiguous' && <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />}
                    {ticker.status === 'invalid' && <X className="h-4 w-4 text-red-500 mr-2" />}
                    
                    <div>
                      <div className="font-medium">{ticker.ticker}</div>
                      {ticker.status === 'valid' && ticker.name && (
                        <div className="text-xs text-muted-foreground">{ticker.name} ({ticker.country})</div>
                      )}
                      {ticker.status === 'ambiguous' && (
                        <div className="mt-1">
                          <Label className="text-xs mb-1 block">Select correct ticker:</Label>
                          <select 
                            className="w-full text-xs p-1 border rounded bg-background"
                            onChange={(e) => resolveAmbiguousTicker(index, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>-- Select ticker --</option>
                            {ticker.matches?.map((match, i) => (
                              <option key={i} value={match}>{match}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {ticker.status === 'invalid' && (
                        <div className="text-xs text-red-500">Unknown ticker. Please remove or correct.</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-20">
                      <Input 
                        type="number" 
                        placeholder="Weight"
                        min="0.01"
                        max="100"
                        step="0.01"
                        className="h-7 text-xs"
                        value={ticker.weight !== null ? ticker.weight : ''}
                        onChange={(e) => updateWeight(index, e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => removeTicker(index)} 
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {parsedTickers.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No tickers to display. Please go back and enter some tickers.
              </div>
            )}
          </div>
        )}
        
        {/* Step 3: Confirmation */}
        {currentStep === 'confirm' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg">Portfolio Summary</h3>
              <span className="text-sm">{portfolioName}</span>
            </div>
            
            <div className="border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Ticker</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Weight (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedTickers
                    .filter(t => t.status === 'valid')
                    .map((ticker, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{ticker.ticker}</TableCell>
                      <TableCell>{ticker.name || ticker.ticker}</TableCell>
                      <TableCell className="text-right">{ticker.weight?.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Total valid tickers: {validTickerCount}</span>
              <span>Total weight: {totalWeight.toFixed(2)}%</span>
            </div>
            
            {Math.abs(totalWeight - 100) > 0.1 && (
              <div className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-500 p-2 rounded text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Weights don't sum to 100%. Would you like to normalize them?</span>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2">
          {currentStep !== 'paste' ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div></div> // Spacer for layout consistency
          )}
          
          <Button onClick={handleNext} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : (
              <>
                {currentStep === 'paste' && 'Continue'}
                {currentStep === 'review' && 'Confirm Portfolio'}
                {currentStep === 'confirm' && 'Save & Analyze'}
                {currentStep !== 'confirm' && <ArrowRight className="ml-2 h-4 w-4" />}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 