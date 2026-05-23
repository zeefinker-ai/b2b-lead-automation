import { config } from './config.js';

export async function filterLead(content) {
  try {
    const response = await fetch(config.groqUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'user',
          content: `Analyze this business website content and extract info.
          Reply ONLY with this exact JSON, no markdown, no backticks:
          {"company":"Name","email":"email@example.com","phone":"123456","businessType":"SaaS","isGoodLead":"yes"}
          
          Content: ${content?.slice(0, 2000)}`
        }]
      })
    });
    const data = await response.json();
    if (!data.choices || !data.choices[0]) return null;
    const text = data.choices[0].message.content.trim();
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    if (!json) return null;
    return JSON.parse(json);
  } catch (error) {
    console.error('❌ Filter error:', error.message);
    return null;
  }
}
