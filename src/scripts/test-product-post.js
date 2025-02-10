import * as prismic from '@prismicio/client';
import { MetaSocialService } from '../lib/newsAutomation.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../../.env.local');
dotenv.config({ path: envPath });

async function testProductPost() {
  try {
    const client = prismic.createClient(process.env.PRISMIC_ENDPOINT, {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    });

    const products = await client.getAllByType('produtos', {
      orderings: {
        field: 'document.first_publication_date',
        direction: 'desc'
      },
      pageSize: 1
    });

    if (!products || products.length === 0) {
      return;
    }

    const metaService = new MetaSocialService();
    await metaService.postToFacebook(products[0], true);
  } catch (error) {
    // Silently fail
  }
}

testProductPost();
