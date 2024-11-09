// src/pages/resultados.js

import React from 'react';

export async function getStaticProps() {
  const API_KEY = process.env.THE_SPORTS_DB_API_KEY;
  const TEAM_ID = '134287-Flamengo'; // ID do Flamengo no TheSportsDB
  const url = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/eventslast.php?id=${TEAM_ID}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) {
      return {
        props: {
          resultados: [],
        },
        revalidate: 60,
      };
    }

    // Obter os últimos 5 eventos
    const últimos5 = data.results.slice(0, 5).map(evento => {
      const isHome = evento.strHomeTeam === 'Flamengo';
      const golsFlamengo = isHome ? parseInt(evento.intHomeScore) : parseInt(evento.intAwayScore);
      const golsAdversario = isHome ? parseInt(evento.intAwayScore) : parseInt(evento.intHomeScore);
      let resultado;

      if (golsFlamengo > golsAdversario) {
        resultado = 'V';
      } else if (golsFlamengo < golsAdversario) {
        resultado = 'D';
      } else {
        resultado = 'E';
      }

      return {
        id: evento.idEvent,
        adversario: isHome ? evento.strAwayTeam : evento.strHomeTeam,
        placar: `${golsFlamengo} - ${golsAdversario}`,
        resultado,
      };
    });

    return {
      props: {
        resultados: últimos5,
      },
      revalidate: 60, // ISR: Revalida a cada 60 segundos
    };
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    return {
      props: {
        resultados: [],
      },
      revalidate: 60,
    };
  }
}
