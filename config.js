import 'dotenv/config';

if (!process.env.GROQ_API_KEY || !process.env.JINA_API_KEY) {
  console.error("❌ CRITICAL ERROR: Missing API keys in your .env file!");
  process.exit(1);
}

export const config = {
  groqKey: process.env.GROQ_API_KEY,
  jinaKey: process.env.JINA_API_KEY,
  groqUrl: 'https://api.groq.com/openai/v1/chat/completions',
  jinaUrl: 'https://r.jina.ai/'
};
