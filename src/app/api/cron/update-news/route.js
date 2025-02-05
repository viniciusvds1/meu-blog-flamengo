import { NextResponse } from 'next/server';
import { fetchAndCreateFlamengoNews } from '@/lib/newsAutomation';

export const runtime = 'nodejs';

export async function GET(request) {
  // Verificar header de segurança
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const result = await fetchAndCreateFlamengoNews();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Erro na rota de atualização de notícias:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

// Configurar para executar a cada 30 minutos
export const maxDuration = 300; // 5 minutos
