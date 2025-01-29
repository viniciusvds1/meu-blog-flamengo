import { NextResponse } from 'next/server';
import { getFlamengoTeamId } from '@/utils/getFlamengoTeamId';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const last = parseInt(searchParams.get('last')) || 1;
  const next = parseInt(searchParams.get('next')) || 1;

  const TEAM_ID = await getFlamengoTeamId();
  const BRASILEIRO_LEAGUE_ID = 71;
  const CARIOCA_LEAGUE_ID = 624;
  const CURRENT_SEASON = new Date().getFullYear();

  // Objeto para armazenar os dados
  const data = {
    resultados: [],
    proximosJogos: [],
    tabelaBrasileiro: null,
    tabelaCarioca: null,
    estatisticasBrasileiro: null,
    estatisticasCarioca: null,
  };

  try {
    // Buscar resultados e próximos jogos primeiro
    const [resultados, proximosJogos] = await Promise.all([
      fetchUltimosJogos(TEAM_ID, last).catch(error => {
        console.error('Erro ao buscar últimos jogos:', error);
        return [];
      }),
      fetchProximosJogos(TEAM_ID, next).catch(error => {
        console.error('Erro ao buscar próximos jogos:', error);
        return [];
      })
    ]);

    data.resultados = resultados;
    data.proximosJogos = proximosJogos;

    // Tentar buscar tabelas e estatísticas
    try {
      const [tabelaBrasileiro, tabelaCarioca] = await Promise.all([
        fetchTabelaCampeonato(BRASILEIRO_LEAGUE_ID, 2024, 'brasileiro').catch(() => null),
        fetchTabelaCampeonato(CARIOCA_LEAGUE_ID, CURRENT_SEASON, 'carioca').catch(() => null)
      ]);

      data.tabelaBrasileiro = tabelaBrasileiro;
      data.tabelaCarioca = tabelaCarioca;

      // Só busca estatísticas se conseguiu buscar as tabelas
      if (tabelaBrasileiro || tabelaCarioca) {
        const [estatisticasBrasileiro, estatisticasCarioca] = await Promise.all([
          fetchEstatisticasTime(TEAM_ID, BRASILEIRO_LEAGUE_ID, 2024, 'brasileiro').catch(() => null),
          fetchEstatisticasTime(TEAM_ID, CARIOCA_LEAGUE_ID, CURRENT_SEASON, 'carioca').catch(() => null)
        ]);

        data.estatisticasBrasileiro = estatisticasBrasileiro;
        data.estatisticasCarioca = estatisticasCarioca;
      }
    } catch (error) {
      console.error('Erro ao buscar tabelas ou estatísticas:', error);
      // Continua com os dados já obtidos
    }

    // Se não conseguiu buscar nenhum dado, retorna erro
    if (!data.resultados.length && !data.proximosJogos.length) {
      return NextResponse.json(
        { error: 'Não foi possível buscar nenhum dado' },
        { status: 500 }
      );
    }

    // Retorna os dados disponíveis
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados da API' },
      { status: 500 }
    );
  }
}

async function fetchUltimosJogos(teamId, last = 1) {
  if (!process.env.RAPIDAPI_KEY) {
    throw new Error('RAPIDAPI_KEY não configurada');
  }

  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?team=${teamId}&last=${last}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Falha ao buscar últimos jogos: ${res.status} ${errorData.message || ''}`);
    }

    const data = await res.json();
    if (!data.response) {
      return [];
    }

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
    throw error;
  }
}

async function fetchProximosJogos(teamId, next = 1) {
  if (!process.env.RAPIDAPI_KEY) {
    throw new Error('RAPIDAPI_KEY não configurada');
  }

  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?team=${teamId}&next=${next}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Falha ao buscar próximos jogos: ${res.status} ${errorData.message || ''}`);
    }

    const data = await res.json();
    if (!data.response) {
      return [];
    }

    return data.response.map((fixture) => {
      const { fixture: { id, date, venue }, teams, league } = fixture;
      const isHome = teams.home.name.toLowerCase() === 'flamengo';

      return {
        id,
        adversario: isHome ? teams.away.name : teams.home.name,
        adversarioBadge: isHome ? teams.away.logo : teams.home.logo,
        flamengoBadge: isHome ? teams.home.logo : teams.away.logo,
        data: new Date(date).toLocaleDateString('pt-BR'),
        horario: new Date(date).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        local: venue.name,
        campeonato: league.name,
      };
    });
  } catch (error) {
    console.error('Erro ao buscar próximos jogos:', error);
    throw error;
  }
}

async function fetchTabelaCampeonato(leagueId, season, campeonato = 'brasileiro') {
  if (!process.env.RAPIDAPI_KEY) {
    throw new Error('RAPIDAPI_KEY não configurada');
  }

  const url = `https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueId}&season=${season}`;
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Falha ao buscar tabela: ${res.status} ${errorData.message || ''}`);
    }

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
    throw error;
  }
}

async function fetchEstatisticasTime(teamId, leagueId, season, championship) {
  if (!process.env.RAPIDAPI_KEY) {
    throw new Error('RAPIDAPI_KEY não configurada');
  }

  // First, fetch recent fixtures to get a match ID
  const fixturesUrl = `https://api-football-v1.p.rapidapi.com/v3/fixtures?team=${teamId}&league=${leagueId}&season=${season}&last=1`;
  
  try {
    const fixturesRes = await fetch(fixturesUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    if (!fixturesRes.ok) {
      const errorData = await fixturesRes.json().catch(() => ({}));
      throw new Error(`Falha ao buscar estatísticas: ${fixturesRes.status} ${errorData.message || ''}`);
    }

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
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    if (!statsRes.ok) {
      const errorData = await statsRes.json().catch(() => ({}));
      throw new Error(`Falha ao buscar estatísticas: ${statsRes.status} ${errorData.message || ''}`);
    }

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
    throw error;
  }
}