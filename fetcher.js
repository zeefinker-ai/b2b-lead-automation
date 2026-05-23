import { config } from './config.js';

export async function fetchPageContent(targetUrl) {
  try {
    const fullUrl = `${config.jinaUrl}${targetUrl}`;
    
    console.log(`📡 Fetching clean data from: ${targetUrl}`);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.jinaKey}`,
        'Accept': 'text/plain'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP status error: ${response.status}`);
    }

    const cleanTextData = await response.text();
    return cleanTextData;

  } catch (error) {
    console.error(`⚠️ Fetcher failed for ${targetUrl}:`, error.message);
    return null;
  }
}
