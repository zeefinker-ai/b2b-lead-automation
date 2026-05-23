import { config } from './config.js';

export async function generatePitch(leadData) {
  if (!leadData || leadData.isGoodLead !== 'yes') return null;

  try {
    const initialPrompt = `You are an expert automation consultant. Write a short 3-sentence email to ${leadData.company}. 
    Their business type is ${leadData.businessType}. Offer them a custom workflow automation that eliminates repetitive tasks. 
    Keep it strictly factual based on this info. Do not include subject lines or salutations yet.`;

    const response = await fetch(config.groqUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: initialPrompt }]
      })
    });

    const data = await response.json();
    const rawPitch = data.choices[0].message.content.trim();

    const criticPrompt = `Rewrite this email draft to sound like a natural text message sent from an iPhone by a technical peer. 
    Remove all marketing filler, phrases like "I hope this finds you well", or exclamation marks. Keep it under 60 words:
    
    Draft: ${rawPitch}`;

    const refinedResponse = await fetch(config.groqUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: criticPrompt }]
      })
    });

    const refinedData = await refinedResponse.json();
    return refinedData.choices[0].message.content.trim();

  } catch (error) {
    console.error('❌ Pitch generation error:', error.message);
    return null;
  }
}
