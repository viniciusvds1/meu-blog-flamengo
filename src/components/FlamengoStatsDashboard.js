/**
 * Componente do painel de estatísticas do Flamengo.
 *
 * @returns {JSX.Element} - Elemento JSX do painel de estatísticas.
 * 
 * 
 */
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function FlamengoStatsDashboard() {
  const [data, setData] = useState({
    tabelaBrasileiro: null,
    tabelaCarioca: null,
    estatisticasBrasileiro: null,
    estatisticasCarioca: null,
  });
  const [selectedChampionship, setSelectedChampionship] = useState('brasileiro');
  const [selectedStatsChampionship, setSelectedStatsChampionship] = useState('brasileiro');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Efetua a busca dos dados da API.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/flamengoGames?last=5&next=5');

        if (!res.ok) {
          throw new Error('Falha ao buscar dados da API');
        }
        const fetchedData = await res.json();

        setData({
          tabelaBrasileiro: fetchedData.tabelaBrasileiro,
          tabelaCarioca: fetchedData.tabelaCarioca,
          estatisticasBrasileiro: fetchedData.estatisticasBrasileiro,
          estatisticasCarioca: fetchedData.estatisticasCarioca,
        });
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="text-red-600" role="alert">
        Erro ao carregar dados: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" role="status">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }

  /**
   * Renderiza a tabela de campeonato.
   *
   * @param {object} tabela - Dados da tabela de campeonato.
   * @returns {JSX.Element} - Elemento JSX da tabela de campeonato.
   */
  const renderChampionshipTable = (tabela) => {
    if (!tabela) {
      return (
        <div className="text-center text-gray-500" role="alert">
          Tabela não disponível
        </div>
      );
    }

    const tabelaData = Array.isArray(tabela) ? tabela : (tabela.tabela || []);

    if (!Array.isArray(tabelaData) || tabelaData.length === 0) {
      return (
        <div className="text-center text-gray-500" role="alert">
          Tabela não disponível
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table
          className="table table-zebra w-full"
          aria-label="Tabela de campeonato"
          role="table"
        >
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="text-center" scope="col">
                Pos
              </th>
              <th scope="col">Time</th>
              <th className="text-center" scope="col">
                Pts
              </th>
              <th className="text-center" scope="col">
                J
              </th>
              <th className="text-center" scope="col">
                V
              </th>
              <th className="text-center" scope="col">
                E
              </th>
              <th className="text-center" scope="col">
                D
              </th>
            </tr>
          </thead>
          <tbody>
            {tabelaData.map((time) => (
              <tr
                key={time.posicao}
                className={
                  time.time === 'Flamengo' ? 'bg-red-100 font-bold' : ''
                }
              >
                <td className="text-center">{time.posicao}</td>
                <td className="flex items-center space-x-2">
                  <Image
                    src={time.logo}
                    alt={time.time}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <span>{time.time}</span>
                </td>
                <td className="text-center">{time.pontos}</td>
                <td className="text-center">{time.jogos}</td>
                <td className="text-center">{time.vitorias}</td>
                <td className="text-center">{time.empates}</td>
                <td className="text-center">{time.derrotas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Renderiza as estatísticas do time.
   *
   * @param {object} estatisticas - Dados das estatísticas do time.
   * @returns {JSX.Element} - Elemento JSX das estatísticas do time.
   */
  const renderStatistics = (estatisticas) => {
    if (!estatisticas) {
      return (
        <div className="text-center text-gray-500" role="alert">
          Estatísticas não disponíveis
        </div>
      );
    }

    const statsList = [
      { label: 'Gols Marcados', value: estatisticas.golsMarcados },
      { label: 'Posse de Bola', value: estatisticas.posse },
      { label: 'Chutes no Gol', value: estatisticas.chutesNoGol },
      { label: 'Escanteios', value: estatisticas.escanteios },
      { label: 'Faltas', value: estatisticas.faltas },
    ];

    return (
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        aria-label="Estatísticas do time"
      >
        {statsList.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
          >
            <span className="font-semibold text-gray-600">{stat.label}:</span>
            <span className="text-lg font-bold text-red-600">
              {stat.value || 'N/A'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-red-700 mb-8">
        Flamengo - Tabelas e Estatísticas
      </h1>

      {/* Campeonatos */}
      <section className="mb-12">
        <div
          className="tabs tabs-boxed mb-6 justify-center"
          aria-label="Selecione o campeonato"
        >
          <button
            className={`tab ${selectedChampionship === 'brasileiro' ? 'tab-active' : ''}`}
            onClick={() => setSelectedChampionship('brasileiro')}
          >
            Brasileiro
          </button>
          <button
            className={`tab ${selectedChampionship === 'carioca' ? 'tab-active' : ''}`}
            onClick={() => setSelectedChampionship('carioca')}
          >
            Carioca
          </button>
        </div>

        {selectedChampionship === 'brasileiro'
          ? renderChampionshipTable(data.tabelaBrasileiro)
          : renderChampionshipTable(data.tabelaCarioca)}
      </section>

      {/* Estatísticas */}
      <section>
        <div
          className="tabs tabs-boxed mb-6 justify-center"
          aria-label="Selecione as estatísticas"
        >
          <button
            className={`tab ${selectedStatsChampionship === 'brasileiro' ? 'tab-active' : ''}`}
            onClick={() => setSelectedStatsChampionship('brasileiro')}
          >
            Brasileiro
          </button>
          <button
            className={`tab ${selectedStatsChampionship === 'carioca' ? 'tab-active' : ''}`}
            onClick={() => setSelectedStatsChampionship('carioca')}
          >
            Carioca
          </button>
        </div>

        {renderStatistics(
          selectedStatsChampionship === 'brasileiro'
            ? data.estatisticasBrasileiro
            : data.estatisticasCarioca
        )}
      </section>
    </div>
  );
}
