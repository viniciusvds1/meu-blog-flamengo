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

import { fetchAndCreateFlamengoNews } from '../src/lib/newsAutomation.mjs';

async function runNewsUpdate() {
  try {
    const result = await fetchAndCreateFlamengoNews();
    console.log('Resultado:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Erro ao atualizar notícias:', error);
    throw error;
  }
}

runNewsUpdate().catch((error) => {
  console.error('Erro ao executar a atualização de notícias:', error);
  throw error;
});
