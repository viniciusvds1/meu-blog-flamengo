import { supabase } from './supabase';

const CACHE_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const LINEUP_UPDATE_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 dias em milliseconds

export async function getStoredData(dataType, params = {}) {
  try {
    const { data, error } = await supabase
      .from('flamengo_data')
      .select('*')
      .eq('data_type', dataType)
      .single();

    if (error) {
      console.error('Supabase getStoredData error:', error);
      return null;
    }

    if (data) {
      const lastUpdate = new Date(data.updated_at).getTime();
      const now = new Date().getTime();
      if (now - lastUpdate > CACHE_DURATION) {
        return null;
      }
      return data.content;
    }

    return null;
  } catch (error) {
    console.error('Error in getStoredData:', error);
    return null;
  }
}

export async function storeData(dataType, content) {
  try {
    // Trata dados de lineup de forma especial
    if (dataType === 'team_lineup') {
      return await storeTeamLineup(content);
    }
    
    const { data: existingData, error: selectError } = await supabase
      .from('flamengo_data')
      .select('id')
      .eq('data_type', dataType)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { 
      console.error('Error checking existing data:', selectError);
      throw selectError;
    }

    if (existingData) {
      const { error } = await supabase
        .from('flamengo_data')
        .update({
          content,
          updated_at: new Date().toISOString()
        })
        .eq('data_type', dataType);

      if (error) {
        console.error('Error updating data:', error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('flamengo_data')
        .insert({
          data_type: dataType,
          content,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error inserting data:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in storeData:', error);
    throw error;
  }
}

// Funu00e7u00e3o para armazenar dados na tabela team_lineup
export async function storeTeamLineup(lineupData) {
  try {
    // Verifica se ju00e1 existe um registro para Flamengo
    const { data: existingData, error: selectError } = await supabase
      .from('team_lineup')
      .select('*')
      .eq('team_name', 'Flamengo')
      .single();
      
    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }
    
    if (existingData) {
      // Atualiza registro existente
      const { error: updateError } = await supabase
        .from('team_lineup')
        .update({
          formation: lineupData.formacao,
          players: lineupData.jogadores,
          last_update: new Date().toISOString()
        })
        .eq('team_name', 'Flamengo');
        
      if (updateError) throw updateError;
    } else {
      // Insere novo registro
      const { error: insertError } = await supabase
        .from('team_lineup')
        .insert({
          team_name: 'Flamengo',
          formation: lineupData.formacao,
          players: lineupData.jogadores,
          last_update: new Date().toISOString()
        });
        
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao armazenar dados do elenco:', error);
    throw error;
  }
}

// Funu00e7u00e3o para buscar dados do elenco
export async function getTeamLineup() {
  try {
    const { data, error } = await supabase
      .from('team_lineup')
      .select('*')
      .eq('team_name', 'Flamengo')
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { // Registro nu00e3o encontrado
        console.log('Nenhum registro de elenco encontrado no Supabase');
        return { data: null, needsUpdate: true };
      }
      console.error('Erro ao consultar Supabase:', error);
      throw error;
    }
    
    if (!data) {
      console.log('Dados do elenco nu00e3o encontrados');
      return { data: null, needsUpdate: true };
    }
    
    // Verifica se os dados precisam ser atualizados (1 semana)
    const now = new Date();
    const lastUpdate = new Date(data.last_update);
    const needsUpdate = (now - lastUpdate) > LINEUP_UPDATE_INTERVAL;
    
    // Formata os dados para o formato esperado pelo frontend
    return { 
      data: {
        formacao: data.formation || '',
        jogadores: data.players || [],
        lastUpdate: data.last_update
      }, 
      needsUpdate 
    };
  } catch (error) {
    console.error('Erro ao buscar dados do elenco:', error);
    // Sempre retorna um objeto estruturado, mesmo em caso de erro
    return { data: null, needsUpdate: true };
  }
}
