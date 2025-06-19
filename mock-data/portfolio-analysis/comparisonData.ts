/**
 * Mock data for stock comparison features
 */

// Stock vs Portfolio exposures for different factors
export const getComparisonData = (ticker: string) => {
  if (ticker === 'TXN') {
    return [
      { name: 'Quality', portfolio: 0.6, stock: 0.8 },
      { name: 'Valuation', portfolio: -0.4, stock: -0.3 },
      { name: 'Momentum', portfolio: 0.85, stock: 0.4 },
      { name: 'Risk', portfolio: -0.25, stock: 0.7 },
      { name: 'Growth', portfolio: 0.15, stock: 0.1 }
    ];
  } else if (ticker === 'ROP') {
    return [
      { name: 'Quality', portfolio: 0.6, stock: 0.75 },
      { name: 'Valuation', portfolio: -0.4, stock: -0.5 },
      { name: 'Momentum', portfolio: 0.85, stock: 0.9 },
      { name: 'Risk', portfolio: -0.25, stock: 0.2 },
      { name: 'Growth', portfolio: 0.15, stock: 0.4 }
    ];
  } else { // ADI
    return [
      { name: 'Quality', portfolio: 0.6, stock: 0.4 },
      { name: 'Valuation', portfolio: -0.4, stock: 0.6 },
      { name: 'Momentum', portfolio: 0.85, stock: 0.3 },
      { name: 'Risk', portfolio: -0.25, stock: 0.8 },
      { name: 'Growth', portfolio: 0.15, stock: -0.2 }
    ];
  }
};

// Stock comparison analysis text
export const getComparisonAnalysis = (ticker: string) => {
  if (ticker === 'TXN') {
    return "<span class='font-medium'>TXN</span> has stronger <span class='font-medium'>Quality</span> and <span class='font-medium'>Risk</span> exposure than your portfolio, but weaker <span class='font-medium'>Momentum</span> exposure. Consider adding this stock to increase your quality factor exposure.";
  } else if (ticker === 'ROP') {
    return "<span class='font-medium'>ROP</span> has very similar <span class='font-medium'>Momentum</span> and <span class='font-medium'>Quality</span> exposure to your overall portfolio. Adding this stock would maintain your current factor tilt.";
  } else { // ADI
    return "<span class='font-medium'>ADI</span> offers significantly more <span class='font-medium'>Valuation</span> and <span class='font-medium'>Risk</span> exposure than your portfolio. Consider adding this stock to diversify your factor exposures.";
  }
}; 