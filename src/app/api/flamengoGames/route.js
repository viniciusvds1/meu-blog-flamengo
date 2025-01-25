import { NextResponse } from 'next/server';
import { getFlamengoTeamId } from '@/utils/getFlamengoTeamId';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const last = parseInt(searchParams.get('last')) || 1;
  const next = parseInt(searchParams.get('next')) || 1;

  const CACHE_KEY = 'flamengoData';
  const CACHE_TIME_KEY = 'flamengoDataTimestamp';
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hora em milissegundos

  const now = Date.now();

  // Verificar o cache
  const cachedData = JSON.parse(globalThis.localStorage?.getItem(CACHE_KEY) || null);
  const lastUpdated = parseInt(globalThis.localStorage?.getItem(CACHE_TIME_KEY) || 0);

  if (cachedData && lastUpdated && now - lastUpdated < CACHE_DURATION) {
    // Retorna os dados do cache se ainda forem válidos
    return NextResponse.json(cachedData, { status: 200 });
  }

  // Se o cache estiver expirado ou inexistente, buscar novos dados da API
  const TEAM_ID = await getFlamengoTeamId();
  const BRASILEIRO_LEAGUE_ID = 71;
  const CARIOCA_LEAGUE_ID = 624;
  const CURRENT_SEASON = new Date().getFullYear();

  try {
    const [
      resultados,
      proximosJogos,
      tabelaBrasileiro,
      tabelaCarioca,
      estatisticasBrasileiro,
      estatisticasCarioca,
    ] = await Promise.all([
      fetchUltimosJogos(TEAM_ID, last),
      fetchProximosJogos(TEAM_ID, next),
      fetchTabelaCampeonato(BRASILEIRO_LEAGUE_ID, 2024, 'brasileiro'),
      fetchTabelaCampeonato(CARIOCA_LEAGUE_ID, CURRENT_SEASON, 'carioca'),
      fetchEstatisticasTime(TEAM_ID, BRASILEIRO_LEAGUE_ID, 2024, 'brasileiro'),
      fetchEstatisticasTime(TEAM_ID, CARIOCA_LEAGUE_ID, CURRENT_SEASON, 'carioca'),
    ]);

    const newData = {
      resultados,
      proximosJogos,
      tabelaBrasileiro,
      tabelaCarioca,
      estatisticasBrasileiro,
      estatisticasCarioca,
    };

    // Armazenar os novos dados no LocalStorage
    globalThis.localStorage?.setItem(CACHE_KEY, JSON.stringify(newData));
    globalThis.localStorage?.setItem(CACHE_TIME_KEY, now.toString());

    return NextResponse.json(newData, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados da API' }, { status: 500 });
  }
}

async function fetchUltimosJogos(teamId, last = 1) {
  const API_KEY = process.env.RAPIDAPI_KEY;
  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?team=${teamId}&last=${last}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    if (!res.ok) throw new Error('Falha ao buscar últimos jogos');

    const data = await res.json();
    if (!data.response) return [];

    return data.response.map((fixture) => {
      const { fixture: { id, date }, teams, goals, league } = fixture;
      const isHome = teams.home.name.toLowerCase() === 'flamengo';
      const golsFlamengo = isHome ? goals.home : goals.away;
      const golsAdversario = isHome ? goals.away : goals.home;

      let resultado;
      if (golsFlamengo > golsAdversario) resultado = 'V';
      else if (golsFlamengo < golsAdversario) resultado = 'D';
      else resultado = 'E';

      return {
        id,
        adversario: isHome ? teams.away.name : teams.home.name,
        placar: `${golsFlamengo} - ${golsAdversario}`,
        resultado,
        adversarioBadge: isHome ? teams.away.logo : teams.home.logo,
        flamengoBadge: isHome ? teams.home.logo : teams.away.logo,
        data: new Date(date).toLocaleDateString('pt-BR'),
        campeonato: league.name,
      };
    });
  } catch (error) {
    console.error('Erro ao buscar últimos jogos:', error);
    return [];
  }
}

async function fetchProximosJogos(teamId, next = 1) {
  const API_KEY = process.env.RAPIDAPI_KEY;
  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?team=${teamId}&next=${next}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    if (!res.ok) throw new Error('Falha ao buscar próximos jogos');

    const data = await res.json();
    if (!data.response) return [];

    return data.response.map((res) => {
      const { fixture: { id, date }, teams, league } = res;
      const isHome = teams.home.name.toLowerCase() === 'flamengo';

      return {
        id,
        adversario: isHome ? teams.away.name : teams.home.name,
        data: new Date(date).toLocaleDateString('pt-BR'),
        horario: new Date(date).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }) + 'h',
        adversarioBadge: isHome ? teams.away.logo : teams.home.logo,
        flamengoBadge: isHome ? teams.home.logo : teams.away.logo,
        campeonato: league.name,
      };
    });
  } catch (error) {
    console.error('Erro ao buscar próximos jogos:', error);
    return [];
  }
}
async function fetchTabelaCampeonato(leagueId, season, campeonato = 'brasileiro') {
  const API_KEY = process.env.RAPIDAPI_KEY;
  const url = `https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueId}&season=${season}`;
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });


    const data = await res.json();
    if (!data.response || data.response.length === 0) {
      return null;
    }
    const standings = data.response[0].league.standings[0];
    
    return {
      nome: campeonato === 'carioca' ? 'Campeonato Carioca' : 'Serie A',
      tabela: standings.map(team => ({
        posicao: team.rank,
        time: team.team.name,
        pontos: team.points,
        jogos: team.all.played,
        vitorias: team.all.win,
        empates: team.all.draw,
        derrotas: team.all.lose,
        logo: team.team.logo
      }))
    };
  } catch (error) {
    console.error('Erro ao buscar tabela:', error);
    return null;
  }
}

async function fetchEstatisticasTime(teamId, leagueId, season, championship) {
  const API_KEY = process.env.RAPIDAPI_KEY;
  
  // First, fetch recent fixtures to get a match ID
  const fixturesUrl = `https://api-football-v1.p.rapidapi.com/v3/fixtures?team=${teamId}&league=${leagueId}&season=${season}&last=1`;
  
  try {
    const fixturesRes = await fetch(fixturesUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    const fixturesData = await fixturesRes.json();
    
    if (!fixturesData.response || fixturesData.response.length === 0) {
      return null;
    }

    const fixtureId = fixturesData.response[0].fixture.id;

    // Now fetch statistics for this specific fixture
    const statsUrl = `https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics?fixture=${fixtureId}&team=${teamId}`;
    
    const statsRes = await fetch(statsUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    const statsData = await statsRes.json();
    
    if (!statsData.response || statsData.response.length === 0) {
      return null;
    }
    const statistics = statsData.response[0].statistics;
    
    return {
      campeonato: championship === 'carioca' ? 'Campeonato Carioca' : 'Serie A',
      golsMarcados: statistics.find(stat => stat.type === 'Goals')?.value || 0,
      posse: statistics.find(stat => stat.type === 'Ball Possession')?.value || '0%',
      chutesNoGol: statistics.find(stat => stat.type === 'Shots on Goal')?.value || 0,
      escanteios: statistics.find(stat => stat.type === 'Corner Kicks')?.value || 0,
      faltas: statistics.find(stat => stat.type === 'Fouls')?.value || 0
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return null;
  }
}