import { config } from 'dotenv-safe';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({
  path: path.resolve(__dirname, '../.env'),
  example: path.resolve(__dirname, '../.env.example'),
  allowEmptyValues: false
});

import { fetchAndCreateFlamengoNews } from '../src/lib/newsAutomation.js';

async function runNewsUpdate() {
  try {
    const result = await fetchAndCreateFlamengoNews();
    console.log('Resultado:', JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

runNewsUpdate();
