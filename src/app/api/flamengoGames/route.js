import { NextResponse } from 'next/server';
import { getStoredData, storeData, getTeamLineup, storeTeamLineup } from '@/lib/supabaseOperations';

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

// Função para buscar o elenco completo do time e o técnico
async function fetchTeamLineup(teamId) {
  try {
    // Busca o elenco completo usando o endpoint players/squads
    const squadData = await fetchFromAPI(
      `https://api-football-v1.p.rapidapi.com/v3/players/squads?team=${teamId}`
    );
    
    if (!squadData.response || squadData.response.length === 0) {
      throw new Error('Nenhum dado de elenco encontrado');
    }
    
    const teamData = squadData.response[0];
    
    if (!teamData || !teamData.players || teamData.players.length === 0) {
      throw new Error('Dados de jogadores não encontrados');
    }
    
    // Busca informações do técnico
    const coachData = await fetchFromAPI(
      `https://api-football-v1.p.rapidapi.com/v3/coachs?team=${teamId}`
    );
    
    // Formata os dados dos jogadores

    const playersData = teamData.players.map(player => ({
      
      id: player.id,
      nome: player.name,
      apelido: player.name,
      posicao: mapPositionFromSquad(player.position),
      numero: player.number?.toString() || 'N/A',
      foto: player.photo || '/assets/bannerubro.png',
      idade: player.age || 0,
      altura: '', // Não disponível neste endpoint
      peso: '', // Não disponível neste endpoint
      titular: false, // Não temos essa informação neste endpoint
      socialMedia: {
        instagram: ""
      }
    }));
    
    // Adiciona técnico com informações detalhadas
    let treinador = {
      id: 21,
      nome: 'Filipe Luis',
      apelido: 'Filipe Luis',
      posicao: 'Técnico',
      foto: '/assets/coaches/filipeluis.webp', // Imagem webp existente
      nacionalidade: 'Brasil',
      idade: 38
    };
    
    // Adiciona informações detalhadas do técnico se disponíveis
    if (coachData && coachData.response && coachData.response.length > 0) {
      const coach = coachData.response[0];
      // Verifica se o técnico retornado não é o Filipe Luis (possível informação desatualizada na API)
      if (coach.name.toLowerCase().includes('filipe') || coach.firstname?.toLowerCase().includes('filipe')) {
        treinador = {
          id: coach.id,
          nome: `${coach.firstname} ${coach.lastname}`.trim(),
          apelido: coach.name,
          posicao: 'Técnico',
          foto: '/assets/coaches/filipeluis.webp' || '/assets/bannerubro.png',
          nacionalidade: coach.nationality,
          idade: coach.age || 38,
          altura: coach.height || '',
          peso: coach.weight || ''
        };
      } else {
        // Se não for o Filipe Luis, mantenha nossos dados atuais sobre ele
        console.log('Técnico na API não corresponde ao Filipe Luis, usando dados locais');
        // Sempre mantenha a imagem local do Filipe Luis
      }
    }
    
    playersData.push(treinador);
    
    return {
      lastUpdate: new Date().toISOString(),
      formacao: '', // Não temos formação neste endpoint
      jogadores: playersData
    };
  } catch (error) {
    console.error('Erro ao buscar dados do elenco:', error);
    throw error;
  }
}

// Mapeia posições do endpoint squad para nomes completos
function mapPositionFromSquad(position) {
  const positions = {
    'Goalkeeper': 'Goleiro',
    'Defender': 'Zagueiro',
    'Midfielder': 'Meio-campista',
    'Attacker': 'Atacante'
  };
  
  return positions[position] || position || 'Não especificado';
}

// Mapeia abreviações de posições para nomes completos
function mapPosition(pos) {
  const positions = {
    G: 'Goleiro',
    D: 'Zagueiro',
    M: 'Meio-campista',
    F: 'Atacante',
    DF: 'Lateral-direito',
    MF: 'Lateral-esquerdo'
  };
  
  return positions[pos] || pos || 'Não especificado';
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const last = parseInt(searchParams.get('last')) || 1;
    const next = parseInt(searchParams.get('next')) || 1;
    const elencoOnly = searchParams.get('elenco') === 'true';
    const forceUpdate = searchParams.get('force_update') === 'true';

    const TEAM_ID = 127; // Flamengo
    const BRASILEIRO_LEAGUE_ID = 71;
    const CARIOCA_LEAGUE_ID = 624;
    const CURRENT_SEASON = new Date().getFullYear();
    
    // Se for apenas solicitação de elenco, retorna apenas esses dados
    if (elencoOnly) {
      try {
        // Busca dados da tabela específica do elenco
        const teamLineupResult = await getTeamLineup();
        const needsUpdate = teamLineupResult?.needsUpdate || true;
        const cachedLineup = teamLineupResult?.data || null;
        
        // Se temos dados em cache e eles não precisam ser atualizados
        if (cachedLineup && !needsUpdate && !forceUpdate) {
          return NextResponse.json({
            formacao: cachedLineup.formacao,
            jogadores: cachedLineup.jogadores,
            lastUpdate: cachedLineup.lastUpdate
          });
        }
        
        // Busca novos dados e armazena na tabela específica
        const lineupData = await fetchTeamLineup(TEAM_ID);
        await storeTeamLineup(lineupData);
        
        return NextResponse.json(lineupData);
      } catch (error) {
        console.error('Erro ao buscar dados do elenco:', error);
        // Em caso de erro, ainda tenta retornar dados do elenco da API
        try {
          const lineupData = await fetchTeamLineup(TEAM_ID);
          return NextResponse.json(lineupData);
        } catch (fetchError) {
          return NextResponse.json(
            { 
              error: 'Erro ao buscar dados do elenco',
              details: error.message
            },
            { status: 500 }
          );
        }
      }
    }

    // Para solicitações normais, retorna todos os dados
    const data = {
      resultados: [],
      proximosJogos: [],
      tabelaBrasileiro: null,
      tabelaCarioca: null,
      elenco: null
    };

    try {
      const cachedResults = await getStoredData('ultimos_jogos');
      const cachedNextGames = await getStoredData('proximos_jogos');
      const cachedBrasileiroTable = await getStoredData('tabela_brasileiro');
      const cachedCariocaTable = await getStoredData('tabela_carioca');
      const cachedLineup = await getStoredData('team_lineup');

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
      
      // Verifica se o elenco precisa ser atualizado (1 semana)
      const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos
      const needsLineupUpdate = !cachedLineup || 
                             forceUpdate || 
                             (new Date() - new Date(cachedLineup.lastUpdate) > ONE_WEEK);
      
      if (cachedLineup && !needsLineupUpdate) {
        data.elenco = cachedLineup;
      } else {
        try {
          const lineupData = await fetchTeamLineup(TEAM_ID);
          data.elenco = lineupData;
          await storeData('team_lineup', lineupData);
        } catch (lineupError) {
          console.error('Erro ao buscar dados do elenco:', lineupError);
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