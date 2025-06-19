// Screener API service
import axios from 'axios';

// Metrics API
export const getAllMetrics = async () => {
  try {
    const response = await fetch('/api/v1/screener/metrics');
    const data = await response.json();
    return data.metrics;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }
};

export const getMetricsByCategory = async (category: string) => {
  try {
    const response = await fetch(`/api/v1/screener/metrics?category=${encodeURIComponent(category)}`);
    const data = await response.json();
    return data.metrics;
  } catch (error) {
    console.error(`Error fetching metrics for category ${category}:`, error);
    return [];
  }
};

export const searchMetrics = async (searchTerm: string) => {
  try {
    const response = await fetch(`/api/v1/screener/metrics?search=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    return data.metrics;
  } catch (error) {
    console.error(`Error searching metrics with term ${searchTerm}:`, error);
    return [];
  }
};

export const getMetricsCategorized = async () => {
  try {
    const response = await fetch('/api/v1/screener/metrics?groupByCategory=true');
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error('Error fetching categorized metrics:', error);
    return [];
  }
};

// Columns API
export const getAllColumns = async () => {
  try {
    const response = await fetch('/api/v1/screener/columns');
    const data = await response.json();
    return data.columns;
  } catch (error) {
    console.error('Error fetching columns:', error);
    return [];
  }
};

export const getColumnCategories = async () => {
  try {
    const response = await fetch('/api/v1/screener/columns?groupByCategory=true');
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error('Error fetching column categories:', error);
    return [];
  }
};

export const searchColumns = async (searchTerm: string) => {
  try {
    const response = await fetch(`/api/v1/screener/columns?search=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    return data.columns;
  } catch (error) {
    console.error(`Error searching columns with term ${searchTerm}:`, error);
    return [];
  }
};

// Saved Views API
export const getSavedViews = async () => {
  try {
    const response = await fetch('/api/v1/screener/views');
    const data = await response.json();
    return data.views;
  } catch (error) {
    console.error('Error fetching saved views:', error);
    return [];
  }
};

export const saveView = async (name: string, columns: any[]) => {
  try {
    const response = await fetch('/api/v1/screener/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, columns }),
    });
    const data = await response.json();
    return data.view;
  } catch (error) {
    console.error('Error saving view:', error);
    throw error;
  }
};

export const updateView = async (id: number, name: string, columns: any[]) => {
  try {
    const response = await fetch(`/api/v1/screener/views/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, columns }),
    });
    const data = await response.json();
    return data.view;
  } catch (error) {
    console.error(`Error updating view ${id}:`, error);
    throw error;
  }
};

// Saved Screens API
export const getSavedScreens = async () => {
  try {
    const response = await fetch('/api/v1/screener/screens');
    const data = await response.json();
    return data.screens;
  } catch (error) {
    console.error('Error fetching saved screens:', error);
    return [];
  }
};

export const saveScreen = async (screen: any) => {
  try {
    const response = await fetch('/api/v1/screener/screens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(screen),
    });
    const data = await response.json();
    return data.screen;
  } catch (error) {
    console.error('Error saving screen:', error);
    throw error;
  }
};

// Results API
export const getScreenerResults = async (criteria: any[], country: string, sector: string | null) => {
  try {
    const response = await fetch('/api/v1/screener/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ criteria, country, sector }),
    });
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching screener results:', error);
    return [];
  }
}; 