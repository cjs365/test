/**
 * Client-side service for portfolio analysis
 */
export const portfolioAnalysisService = {
  // Get market-wide factor performance
  getMarketFactorPerformance: async () => {
    try {
      console.log('Calling /api/v1/portfolio-analysis/market-factors from client service');
      const response = await fetch('/api/v1/portfolio-analysis/market-factors');
      if (!response.ok) {
        throw new Error(`Failed to fetch market factors: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Response from /api/v1/portfolio-analysis/market-factors:', data);
      return data.data;
    } catch (error) {
      console.error('Error fetching market factors:', error);
      throw error;
    }
  },

  // Get all watchlists
  getWatchlists: async () => {
    try {
      console.log('Calling /api/v1/portfolio-analysis/watchlists from client service');
      const response = await fetch('/api/v1/portfolio-analysis/watchlists');
      if (!response.ok) {
        throw new Error(`Failed to fetch watchlists: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Response from /api/v1/portfolio-analysis/watchlists:', data);
      return data.data;
    } catch (error) {
      console.error('Error fetching watchlists:', error);
      throw error;
    }
  },

  // Get a specific watchlist by ID
  getWatchlistById: async (id: string) => {
    try {
      console.log(`Calling /api/v1/portfolio-analysis/watchlists/${id} from client service`);
      const response = await fetch(`/api/v1/portfolio-analysis/watchlists/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch watchlist ${id}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Response from /api/v1/portfolio-analysis/watchlists/${id}:`, data);
      return data.data;
    } catch (error) {
      console.error(`Error fetching watchlist ${id}:`, error);
      throw error;
    }
  },

  // Create a new watchlist
  createWatchlist: async (watchlistData: any) => {
    try {
      console.log('Calling POST /api/v1/portfolio-analysis/watchlists from client service');
      const response = await fetch('/api/v1/portfolio-analysis/watchlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(watchlistData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create watchlist: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Response from POST /api/v1/portfolio-analysis/watchlists:', data);
      return data.data;
    } catch (error) {
      console.error('Error creating watchlist:', error);
      throw error;
    }
  },

  // Update an existing watchlist
  updateWatchlist: async (id: string, watchlistData: any) => {
    try {
      console.log(`Calling PUT /api/v1/portfolio-analysis/watchlists/${id} from client service`);
      const response = await fetch(`/api/v1/portfolio-analysis/watchlists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(watchlistData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update watchlist ${id}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Response from PUT /api/v1/portfolio-analysis/watchlists/${id}:`, data);
      return data.data;
    } catch (error) {
      console.error(`Error updating watchlist ${id}:`, error);
      throw error;
    }
  },

  // Delete a watchlist
  deleteWatchlist: async (id: string) => {
    try {
      console.log(`Calling DELETE /api/v1/portfolio-analysis/watchlists/${id} from client service`);
      const response = await fetch(`/api/v1/portfolio-analysis/watchlists/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete watchlist ${id}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Response from DELETE /api/v1/portfolio-analysis/watchlists/${id}:`, data);
      return data.data;
    } catch (error) {
      console.error(`Error deleting watchlist ${id}:`, error);
      throw error;
    }
  },

  // Get attribution analysis for a watchlist
  getAttributionAnalysis: async (id: string) => {
    try {
      console.log(`Calling /api/v1/portfolio-analysis/watchlists/${id}/attribution from client service`);
      const response = await fetch(`/api/v1/portfolio-analysis/watchlists/${id}/attribution`);
      if (!response.ok) {
        throw new Error(`Failed to fetch attribution for watchlist ${id}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Response from /api/v1/portfolio-analysis/watchlists/${id}/attribution:`, data);
      return data.data;
    } catch (error) {
      console.error(`Error fetching attribution for watchlist ${id}:`, error);
      throw error;
    }
  },

  // Get factor model analysis for a watchlist
  getFactorModelAnalysis: async (id: string) => {
    try {
      console.log(`Calling /api/v1/portfolio-analysis/watchlists/${id}/factors from client service`);
      const response = await fetch(`/api/v1/portfolio-analysis/watchlists/${id}/factors`);
      if (!response.ok) {
        throw new Error(`Failed to fetch factor analysis for watchlist ${id}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Response from /api/v1/portfolio-analysis/watchlists/${id}/factors:`, data);
      return data.data;
    } catch (error) {
      console.error(`Error fetching factor analysis for watchlist ${id}:`, error);
      throw error;
    }
  },

  // Get risk analytics for a watchlist
  getRiskAnalytics: async (id: string) => {
    try {
      console.log(`Calling /api/v1/portfolio-analysis/watchlists/${id}/risk from client service`);
      const response = await fetch(`/api/v1/portfolio-analysis/watchlists/${id}/risk`);
      if (!response.ok) {
        throw new Error(`Failed to fetch risk analytics for watchlist ${id}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Response from /api/v1/portfolio-analysis/watchlists/${id}/risk:`, data);
      return data.data;
    } catch (error) {
      console.error(`Error fetching risk analytics for watchlist ${id}:`, error);
      throw error;
    }
  }
}; 