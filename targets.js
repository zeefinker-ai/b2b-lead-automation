export const targets = [
  'https://news.ycombinator.com/rss',
  'https://feeds.feedburner.com/TechCrunch'
];

export async function fetchAndExtractUrls(feedUrl) {
  try {
    // Fetch RSS directly without Jina
    const response = await fetch(feedUrl);
    const xml = await response.text();
    
    const urls = [];
    const items = xml.split('<item>');
    
    for (const item of items) {
      const match = item.match(/<link>(https?:\/\/[^<]+)<\/link>/);
      if (match && match[1]) {
        const url = match[1].trim();
        if (!url.includes('ycombinator') && !url.includes('feed')) {
          urls.push(url);
        }
      }
    }

    console.log(`🔗 Extracted ${urls.length} URLs from ${feedUrl}`);
    return [...new Set(urls)].slice(0, 5);
  } catch (error) {
    console.error(`❌ Feed error: ${error.message}`);
    return [];
  }
}
