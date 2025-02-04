import { NextResponse } from 'next/server';
import { getStoredData, storeData } from '@/lib/supabaseOperations';

async function fetchFromAPI(url) {
  if (!process.env.RAPIDAPI_KEY) {
    throw new Error('RAPIDAPI_KEY não configurada');
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`API Error: ${res.status} ${errorData.message || ''}`);
  }

  const data = await res.json();
  return data;
}

async function fetchUltimosJogos(teamId, last = 1) {
  const data = await fetchFromAPI(
    `https://api-football-v1.p.rapidapi.com/v3/fixtures?team=${teamId}&last=${last}&status=FT`
  );

  if (!data.response) {
    return [];
  }

  return data.response.map((fixture) => {
    const isFlamengo = fixture.teams.home.id === teamId;
    const adversario = isFlamengo ? fixture.teams.away : fixture.teams.home;
    const flamengoTime = isFlamengo ? fixture.teams.home : fixture.teams.away;
    const placar = isFlamengo 
      ? `${fixture.goals.home}x${fixture.goals.away}`
      : `${fixture.goals.away}x${fixture.goals.home}`;

    return {
      id: fixture.fixture.id,
      data: new Date(fixture.fixture.date).toLocaleDateString('pt-BR'),
      horario: new Date(fixture.fixture.date).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit'
      }),
      campeonato: fixture.league.name,
      adversario: adversario.name,
      adversarioBadge: adversario.logo,
      flamengoBadge: flamengoTime.logo,
      placar,
    };
  });
}

async function fetchProximosJogos(teamId, next = 1) {
  const data = await fetchFromAPI(
    `https://api-football-v1.p.rapidapi.com/v3/fixtures?team=${teamId}&next=${next}&status=NS`
  );

  if (!data.response) {
    return [];
  }

  return data.response.map((fixture) => {
    const isFlamengo = fixture.teams.home.id === teamId;
    const adversario = isFlamengo ? fixture.teams.away : fixture.teams.home;
    const flamengoTime = isFlamengo ? fixture.teams.home : fixture.teams.away;

    return {
      id: fixture.fixture.id,
      data: new Date(fixture.fixture.date).toLocaleDateString('pt-BR'),
      horario: new Date(fixture.fixture.date).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit'
      }),
      campeonato: fixture.league.name,
      adversario: adversario.name,
      adversarioBadge: adversario.logo,
      flamengoBadge: flamengoTime.logo,
    };
  });
}

async function fetchTabelaCampeonato(leagueId, season) {
  const data = await fetchFromAPI(
    `https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueId}&season=${season}`
  );

  if (!data.response || data.response.length === 0) {
    return null;
  }

  const standings = data.response[0].league.standings[0];
  return standings.map(team => ({
    posicao: team.rank,
    time: team.team.name,
    pontos: team.points,
    jogos: team.all.played,
    vitorias: team.all.win,
    empates: team.all.draw,
    derrotas: team.all.lose,
    golsPro: team.all.goals.for,
    golsContra: team.all.goals.against,
    saldoGols: team.goalsDiff,
    logo: team.team.logo,
  }));
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const last = parseInt(searchParams.get('last')) || 1;
    const next = parseInt(searchParams.get('next')) || 1;

    const TEAM_ID = 127; // Flamengo
    const BRASILEIRO_LEAGUE_ID = 71;
    const CARIOCA_LEAGUE_ID = 624;
    const CURRENT_SEASON = 2024;

    const data = {
      resultados: [],
      proximosJogos: [],
      tabelaBrasileiro: null,
      tabelaCarioca: null
    };

    try {
      const cachedResults = await getStoredData('ultimos_jogos');
      const cachedNextGames = await getStoredData('proximos_jogos');
      const cachedBrasileiroTable = await getStoredData('tabela_brasileiro');
      const cachedCariocaTable = await getStoredData('tabela_carioca');

      if (cachedResults && cachedNextGames) {
        data.resultados = cachedResults;
        data.proximosJogos = cachedNextGames;
      } else {
        const [resultados, proximosJogos] = await Promise.all([
          fetchUltimosJogos(TEAM_ID, last),
          fetchProximosJogos(TEAM_ID, next)
        ]);

        if (resultados.length > 0) {
          data.resultados = resultados;
          await storeData('ultimos_jogos', resultados);
        }

        if (proximosJogos.length > 0) {
          data.proximosJogos = proximosJogos;
          await storeData('proximos_jogos', proximosJogos);
        }
      }

      if (cachedBrasileiroTable && cachedCariocaTable) {
        data.tabelaBrasileiro = cachedBrasileiroTable;
        data.tabelaCarioca = cachedCariocaTable;
      } else {
        const [tabelaBrasileiro, tabelaCarioca] = await Promise.all([
          fetchTabelaCampeonato(BRASILEIRO_LEAGUE_ID, CURRENT_SEASON),
          fetchTabelaCampeonato(CARIOCA_LEAGUE_ID, CURRENT_SEASON)
        ]);

        if (tabelaBrasileiro) {
          data.tabelaBrasileiro = tabelaBrasileiro;
          await storeData('tabela_brasileiro', tabelaBrasileiro);
        }

        if (tabelaCarioca) {
          data.tabelaCarioca = tabelaCarioca;
          await storeData('tabela_carioca', tabelaCarioca);
        }
      }

      return NextResponse.json(data);
    } catch (innerError) {
      throw innerError;
    }
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Erro ao buscar dados',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}