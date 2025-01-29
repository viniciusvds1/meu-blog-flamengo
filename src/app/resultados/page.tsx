'use client'; 

import React, { useEffect, useState } from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import { motion } from 'framer-motion';
import { RefreshCw, Calendar, Trophy } from 'lucide-react';
import FlamengoStatsDashboard from '@/components/FlamengoStatsDashboard';

interface Resultado {
  id: string;
  resultado: 'V' | 'D' | 'E';
  placar: string;
  adversario: string;
  flamengoBadge: string;
  adversarioBadge: string;
  data: string;
  local: string;
  campeonato: string;
}

interface ProximoJogo {
  id: string;
  adversario: string;
  flamengoBadge: string;
  adversarioBadge: string;
  data: string;
  horario: string;
  campeonato: string;
}

interface Tabela {
  nome: string;
  tabela: {
    posicao: number;
    time: string;
    pontos: number;
    jogos: number;
    vitorias: number;
    empates: number;
    derrotas: number;
    logo: string;
  }[];
}

interface Estatisticas {
  golsMarcados: number;
  golsSofridos: number;
  cleanSheets: number;
  mediaGolsPorJogo: string;
}

export default function ResultadosFlamengo() {
  const [data, setData] = useState<{
    resultados: Resultado[];
    proximosJogos: ProximoJogo[];
    tabelaBrasileiro: Tabela | null;
    tabelaCarioca: Tabela | null;
    estatisticasTime: Estatisticas | null;
  }>({
    resultados: [],
    proximosJogos: [],
    tabelaBrasileiro: null,
    tabelaCarioca: null,
    estatisticasTime: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/flamengoGames?last=5&next=5', {
          cache: 'no-store', // Ensures fresh data on each fetch
        });

        if (!res.ok) {
          throw new Error('Falha ao buscar dados da API');
        }

        const fetchedData = await res.json();
        setData(fetchedData);
        localStorage.setItem('flamengoGamesData', JSON.stringify(fetchedData));
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    const storedData = localStorage.getItem('flamengoGamesData');

    if (storedData) {
      setData(JSON.parse(storedData));
      setLoading(false);
    }

    fetchData();
    const interval = setInterval(fetchData, 36000000); // 10 hours
    return () => clearInterval(interval);
  }, []);

  const getResultColor = (resultado: 'V' | 'D' | 'E') => {
    switch (resultado) {
      case 'V': return 'bg-green-100 border-green-400';
      case 'D': return 'bg-red-100 border-red-400';
      case 'E': return 'bg-yellow-100 border-yellow-400';
      default: return 'bg-gray-100 border-gray-400';
    }
  };

  const truncateText = (text: string, maxLength: number = 12) => {
    return text.length > maxLength 
      ? `${text.slice(0, maxLength)}...` 
      : text;
  };

  const getTeamAbbreviation = (teamName: string): string => {
    const abbreviations: { [key: string]: string } = {
      'Flamengo': 'FLA',
      'Fluminense': 'FLU',
      'Vasco': 'VAS',
      'Botafogo': 'BOT',
      'Palmeiras': 'PAL',
      'São Paulo': 'SAO',
      'Santos': 'SAN',
      'Corinthians': 'COR',
      'Grêmio': 'GRE',
      'Internacional': 'INT',
      'Athletico-PR': 'CAP',
      'Atlético-MG': 'CAM',
      'Cruzeiro': 'CRU',
      'Bahia': 'BAH',
      'Fortaleza': 'FOR',
      'Ceará': 'CEA',
      'Sport': 'SPT',
      'Vitória': 'VIT',
      'Goiás': 'GOI',
      'Coritiba': 'CFC',
      'Nova Iguaçu': 'NIG',
      'Portuguesa-RJ': 'POR',
      'Volta Redonda': 'VRE',
      'Madureira': 'MAD',
      'Sampaio Corrêa-RJ': 'SAM',
      'Audax-RJ': 'AUD',
    };
    
    // Procura por correspondência exata
    if (abbreviations[teamName]) {
      return abbreviations[teamName];
    }
    
    // Se não encontrar, retorna as 3 primeiras letras em maiúsculo
    return teamName.substring(0, 3).toUpperCase();
  };

  const renderResultCard = (resultado: Resultado) => (
    <motion.div
      key={resultado.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-3 sm:p-4 rounded-lg shadow-md ${getResultColor(resultado.resultado)} mx-2 sm:mx-0`}
    >
      <div className="flex justify-center items-center space-x-1 sm:space-x-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex-shrink-0">
          <OptimizedImage
            src={resultado.flamengoBadge ?? '/assets/flamengo.png'}
            alt="Flamengo Logo"
            aspectRatio="aspect-square"
            objectFit="contain"
            priority={false}
          />
        </div>
        <div className="flex items-center w-10 sm:w-12 justify-end">
          <span className="font-bold text-xs sm:text-sm text-gray-800 text-right tracking-tighter">
            {getTeamAbbreviation('Flamengo')}
          </span>
        </div>
        <div className="flex flex-row items-center justify-center min-w-[60px] sm:min-w-[70px]">
          <span className="font-black text-gray-900 text-center whitespace-nowrap">
            {resultado.placar.replace('-', '  -  ')}
          </span>
        </div>
        <div className="flex items-center w-10 sm:w-12 justify-start">
          <span className="font-bold text-xs sm:text-sm text-gray-800 text-left tracking-tighter">
            {getTeamAbbreviation(resultado.adversario)}
          </span>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex-shrink-0">
          <OptimizedImage
            src={resultado.adversarioBadge}
            alt={`${resultado.adversario} Logo`}
            aspectRatio="aspect-square"
            objectFit="contain"
            priority={false}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center mt-2 text-gray-600 space-y-1 sm:space-y-0 sm:space-x-2">
        <div className="flex items-center space-x-1">
          <Calendar size={14} className="sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">{resultado.data}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Trophy size={14} className="sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">{truncateText(resultado.campeonato, window.innerWidth < 640 ? 12 : 15)}</span>
        </div>
      </div>
    </motion.div>
  );

  const renderNextGameCard = (jogo: ProximoJogo) => (
    <motion.div
      key={jogo.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-3 sm:p-4 rounded-lg shadow-md bg-blue-50 border border-blue-200 mx-2 sm:mx-0"
    >
      <div className="flex justify-center items-center space-x-1 sm:space-x-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex-shrink-0">
          <OptimizedImage
            src={jogo.flamengoBadge ?? '/assets/flamengo.png'}
            alt="Flamengo Logo"
            aspectRatio="aspect-square"
            objectFit="contain"
            priority={false}
          />
        </div>
        <div className="flex items-center w-12 sm:w-16 justify-end">
          <span className="font-bold text-xs sm:text-sm text-gray-800 text-right tracking-tighter">
            {getTeamAbbreviation('Flamengo')}
          </span>
        </div>
        <span className="text-base sm:text-lg font-bold text-gray-600 mx-1">vs</span>
        <div className="flex items-center w-12 sm:w-16 justify-start">
          <span className="font-bold text-xs sm:text-sm text-gray-800 text-left tracking-tighter">
            {getTeamAbbreviation(jogo.adversario)}
          </span>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex-shrink-0">
          <OptimizedImage
            src={jogo.adversarioBadge}
            alt={`${jogo.adversario} Logo`}
            aspectRatio="aspect-square"
            objectFit="contain"
            priority={false}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center mt-2 text-gray-600 space-y-1 sm:space-y-0 sm:space-x-2">
        <div className="flex items-center space-x-1">
          <Calendar size={14} className="sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">{jogo.data}</span>
        </div>
        <div className="flex items-center space-x-1">
          <RefreshCw size={14} className="sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">{jogo.horario}</span>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 text-red-800">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 sm:mb-8 text-center text-red-700">
        Flamengo: Resultados e Próximos Jogos
      </h1>

      {/* Últimos Resultados */}
      <section className="mb-6 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
          Últimos Resultados
        </h2>
        {data.resultados.length === 0 ? (
          <p className="text-center text-gray-600">
            Nenhum resultado disponível no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {data.resultados.map(renderResultCard)}
          </div>
        )}
      </section>

      {/* Próximos Jogos */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
          Próximos Jogos
        </h2>
        {data.proximosJogos.length === 0 ? (
          <p className="text-center text-gray-600">
            Nenhum próximo jogo disponível no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {data.proximosJogos.map(renderNextGameCard)}
          </div>
        )}
      </section>
      <FlamengoStatsDashboard />
    </div>
  );
}
