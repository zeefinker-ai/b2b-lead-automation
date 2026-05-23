import { fetchPageContent } from './fetcher.js';
import { filterLead } from './filter.js';
import { generatePitch } from './writer.js';
import { targets, fetchAndExtractUrls } from './targets.js';
import { sendNotification } from './notifier.js';
import { appendFileSync, existsSync, readFileSync } from 'fs';
import 'dotenv/config';

const CACHE_FILE = 'processed_urls.txt';

function isAlreadyProcessed(url) {
  if (!existsSync(CACHE_FILE)) return false;
  const content = readFileSync(CACHE_FILE, 'utf8');
  return content.includes(url);
}

async function processSingleUrl(url) {
  if (isAlreadyProcessed(url)) {
    console.log(`⏭️ Already processed: ${url}`);
    return null;
  }

  const content = await fetchPageContent(url);
  if (!content) return null;

  const lead = await filterLead(content);
  if (lead && lead.isGoodLead === 'yes') {
    console.log(`🎯 Lead Found: ${lead.company}`);
    const pitch = await generatePitch(lead);
    console.log(`📧 Pitch: ${pitch}\n`);
    appendFileSync(CACHE_FILE, `${url}\n`);
    const line = `${lead.company},${lead.email},${lead.phone},${lead.businessType}\n`;
    appendFileSync('leads.csv', line);
    await sendNotification(lead.company, pitch);
    return lead;
  }

  appendFileSync(CACHE_FILE, `${url}\n`);
  return null;
}

async function main() {
  console.log('🚀 Starting Advanced B2B Engine...');
  const deepLinks = [];

  for (const feedUrl of targets) {
    console.log(`📡 Reading Feed: ${feedUrl}`);
    const links = await fetchAndExtractUrls(feedUrl);
    deepLinks.push(...links);
  }

  const uniqueLinks = [...new Set(deepLinks)];
  console.log(`⚙️ Found ${uniqueLinks.length} unique links...`);

  for (const url of uniqueLinks) {
    await processSingleUrl(url);
  }

  console.log('\n✅ Done! Check leads.csv for results.');
}

main();
