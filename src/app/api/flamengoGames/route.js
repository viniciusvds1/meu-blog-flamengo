// src/app/api/flamengoGames/route.js

import { NextResponse } from 'next/server';
import { getFlamengoTeamId } from '@/utils/getFlamengoTeamId';

export async function GET(req) {

  const { searchParams } = new URL(req.url);
  const last = parseInt(searchParams.get('last')) || 1;
  const next = parseInt(searchParams.get('next')) || 1;
  const TEAM_ID = await getFlamengoTeamId();

  if (!TEAM_ID) {
    return NextResponse.json({ error: 'Falha ao obter o ID do Flamengo' }, { status: 500 });
  }

  const [resultados, proximosJogos] = await Promise.all([
    fetchUltimosJogos(TEAM_ID, last),
    fetchProximosJogos(TEAM_ID, next),
  ]);

  if (!resultados || !proximosJogos) {
    return NextResponse.json({ error: 'Falha ao buscar dados dos jogos' }, { status: 500 });
  }

  return NextResponse.json({ resultados, proximosJogos }, { status: 200 });
}

// Funções auxiliares (ajustadas para retornar múltiplos jogos)
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

    if (!res.ok) {
      throw new Error('Falha ao buscar últimos jogos da API');
    }

    const data = await res.json();

    if (!data.response) {
      return [];
    }

    const jogos = data.response.map((fixture) => {
      const { fixture: { id, date }, teams, goals, league } = fixture;
      const isHome = teams.home.name.toLowerCase() === 'flamengo';
      const golsFlamengo = isHome ? goals.home : goals.away;
      const golsAdversario = isHome ? goals.away : goals.home;
      let resultado;

      if (golsFlamengo > golsAdversario) {
        resultado = 'V'; // Vitória
      } else if (golsFlamengo < golsAdversario) {
        resultado = 'D'; // Derrota
      } else {
        resultado = 'E'; // Empate
      }
      const horario = new Date(date).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }) + 'h';
      return {
        id,
        adversario: isHome ? teams.away.name : teams.home.name,
        placar: `${golsFlamengo} - ${golsAdversario}`,
        resultado,
        adversarioBadge: isHome ? teams.away.logo : teams.home.logo,
        flamengoBadge: isHome ? teams.home.logo : teams.away.logo,
        data: new Date(date).toLocaleDateString('pt-BR'),
        horario,
        campeonato: league.name,
      };
    });

    return jogos;
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

    if (!res.ok) {
      throw new Error('Falha ao buscar próximos jogos da API');
    }

    const data = await res.json();

    if (!data.response) {
      return [];
    }

    const jogos = data.response.map((fixture) => {
      const { fixture: { id, date }, teams, league } = fixture;
      const isHome = teams.home.name.toLowerCase() === 'flamengo';
      const adversario = isHome ? teams.away.name : teams.home.name;
      const adversarioBadge = isHome ? teams.away.logo : teams.home.logo;
      const flamengoBadge = isHome ? teams.home.logo : teams.away.logo;
      const horario = new Date(date).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }) + 'h';

      return {
        id,
        adversario,
        data: new Date(date).toLocaleDateString('pt-BR'),
        horario,
        adversarioBadge,
        flamengoBadge,
        campeonato: league.name,
      };
    });

    return jogos;
  } catch (error) {
    console.error('Erro ao buscar próximos jogos:', error);
    return [];
  }
}
