# External API Endpoints Documentation

This document lists all external API endpoints used in the Clarval application. External APIs are defined as those with `localhost` or `127.0.0.1` format.

## Search API

### Endpoint: `http://localhost:8000/api/v1/search`

**Used in:** `app/components/layout/MainLayout.tsx`

**Description:** Used for the global search functionality in the main layout. This endpoint powers the search box that appears at the top of the page and returns search results for stocks, ETFs, or news.

**Parameters:**
- `keyword`: The search term entered by the user
- `limit`: Maximum number of results to return (default: 10)

**Example:**
```javascript
const response = await fetch(`http://localhost:8000/api/v1/search?keyword=${encodeURIComponent(searchQuery)}&limit=10`);
```

## Methodology API

### Base URL: `http://127.0.0.1:8000/api`

**Used in:** `api/v1/methodology/service.ts`

**Description:** Used as the base URL for methodology-related API calls. The methodology service attempts to call external APIs first, then falls back to internal APIs, and finally to mock data.

**Endpoints:**
1. `${API_BASE_URL}/v1/articles` - Get all articles
2. `${API_BASE_URL}/v1/articles/${numericId}` - Get a specific article by ID

**Example:**
```javascript
// Base API URL definition
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Get article list with optional filtering
let url = `${API_BASE_URL}/v1/articles?skip=${skip}&limit=${limit}`;
if (group_name) {
  url += `&group_name=${encodeURIComponent(group_name)}`;
}

const response = await axios.get(url, { timeout: 2000 });
```

## Pages Using External APIs

1. **Main Layout Search**: The main application layout with the search functionality at the top of every page
   - File: `app/components/layout/MainLayout.tsx`
   - External API: `http://localhost:8000/api/v1/stock/search`

2. **Methodology Pages**: Articles about investing methodologies
   - Base File: `api/v1/methodology/service.ts`
   - External API Base: `http://127.0.0.1:8000/api`
   - Article List API: `${API_BASE_URL}/v1/articles`
   - Single Article API: `${API_BASE_URL}/v1/articles/${numericId}`

## Notes

1. The application implements a fallback mechanism for the methodology API:
   - First attempts to use the external API (`http://127.0.0.1:8000/api`)
   - If that fails, tries the internal API (`/api/v1/methodology`)
   - Finally falls back to mock data if both APIs fail

2. The search functionality doesn't appear to have a fallback mechanism and directly relies on the external search API.

3. Both external API services appear to be running on port 8000, suggesting they might be part of the same backend service. 