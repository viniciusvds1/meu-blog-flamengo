import { config } from 'dotenv-safe';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar e validar variáveis de ambiente
config({
  path: path.resolve(__dirname, '../.env.local'),
  example: path.resolve(__dirname, '../.env.example'),
  allowEmptyValues: false
});

// Importar depois de carregar as variáveis de ambiente
import { fetchAndCreateFlamengoNews } from '../src/lib/newsAutomation.js';

async function runNewsUpdate() {
  
  try {
    const result = await fetchAndCreateFlamengoNews();
    console.log('Resultado:', result);
  } catch (error) {
    console.error('Erro ao atualizar notícias:', error);
    process.exit(1);
  }
}

runNewsUpdate();
