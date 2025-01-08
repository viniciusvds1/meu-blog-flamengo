export async function getFlamengoTeamId() {
    const API_KEY = process.env.RAPIDAPI_KEY;
    const searchTeamUrl = `https://api-football-v1.p.rapidapi.com/v3/teams?search=Flamengo`;
  
    try {
      const res = await fetch(searchTeamUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        },
      });
      if (!res.ok) {
        throw new Error('Falha ao buscar dados do time');
      }
  
      const data = await res.json();
  
      if (!data.response || data.response.length === 0) {
        throw new Error('Time não encontrado');
      }
  
      const fluminenseTeam = data.response.find(team => team.team.name.toLowerCase() === 'flamengo');
  
      if (!fluminenseTeam) {
        throw new Error('Flamengo não encontrado');
      }
  
      return fluminenseTeam.team.id;
    } catch (error) {
      console.error('Erro ao buscar o ID do time:', error);
      return null;
    }
  }
  