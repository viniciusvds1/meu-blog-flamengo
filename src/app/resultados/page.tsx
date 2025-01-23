'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RefreshCw, Calendar, Trophy } from 'lucide-react';

// Define TypeScript interfaces for better type safety
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

export default function ResultadosFlamengo() {
  const [data, setData] = useState<{
    resultados: Resultado[];
    proximosJogos: ProximoJogo[];
  }>({ resultados: [], proximosJogos: [] });
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

  const renderResultCard = (resultado: Resultado) => (
    <motion.div
      key={resultado.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-4 rounded-lg shadow-md ${getResultColor(resultado.resultado)}`}
    >
      <div className="flex justify-center items-center space-x-2">
        <div className="w-10 h-10 relative flex-shrink-0">
          <Image
            src={resultado.flamengoBadge}
            alt="Flamengo Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex items-center space-x-1 w-24 justify-end">
          <span className="font-bold text-base text-gray-800 text-right">
            {truncateText('Flamengo')}
          </span>
        </div>
        <div className="flex flex-row items-center">
          <span className="text-xl w-[46px]  font-black text-gray-900">
            {resultado.placar}
          </span>
        </div>
        <div className="flex items-center space-x-1 w-24 justify-start">
          <span className="font-bold text-base text-gray-800 text-left">
            {truncateText(resultado.adversario)}
          </span>
        </div>
        <div className="w-10 h-10 relative flex-shrink-0">
          <Image
            src={resultado.adversarioBadge}
            alt={`${resultado.adversario} Logo`}
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex justify-center items-center mt-2 text-gray-600 space-x-2">
        <Calendar size={16} />
        <span className="text-sm">{resultado.data}</span>
        <Trophy size={16} />
        <span className="text-sm">{truncateText(resultado.campeonato, 15)}</span>
      </div>
    </motion.div>
  );

  const renderNextGameCard = (jogo: ProximoJogo) => (
    <motion.div
      key={jogo.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 rounded-lg shadow-md bg-blue-50 border border-blue-200"
    >
      <div className="flex justify-center items-center space-x-2">
        <div className="w-10 h-10 relative flex-shrink-0">
          <Image
            src={jogo.flamengoBadge}
            alt="Flamengo Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex items-center space-x-1 w-24 justify-end">
          <span className="font-bold text-base text-gray-800 text-right">
            {truncateText('Flamengo')}
          </span>
        </div>
        <span className="text-2xl font-bold text-gray-600">vs</span>
        <div className="flex items-center space-x-1 w-24 justify-start">
          <span className="font-bold text-base text-gray-800 text-left">
            {truncateText(jogo.adversario)}
          </span>
        </div>
        <div className="w-10 h-10 relative flex-shrink-0">
          <Image
            src={jogo.adversarioBadge}
            alt={`${jogo.adversario} Logo`}
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex justify-center items-center mt-2 text-gray-600 space-x-2">
        <Calendar size={16} />
        <span className="text-sm">{jogo.data}</span>
        <RefreshCw size={16} />
        <span className="text-sm">{jogo.horario}</span>
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
    <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-red-700">
        Flamengo: Resultados e Próximos Jogos
      </h1>

      {/* Últimos Resultados */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Últimos Resultados
        </h2>
        {data.resultados.length === 0 ? (
          <p className="text-center text-gray-600">
            Nenhum resultado disponível no momento.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.resultados.map(renderResultCard)}
          </div>
        )}
      </section>

      {/* Próximos Jogos */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Próximos Jogos
        </h2>
        {data.proximosJogos.length === 0 ? (
          <p className="text-center text-gray-600">
            Nenhum próximo jogo disponível no momento.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.proximosJogos.map(renderNextGameCard)}
          </div>
        )}
      </section>
    </div>
  );
}