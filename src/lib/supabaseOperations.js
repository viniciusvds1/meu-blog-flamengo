import { supabase } from './supabase';

const CACHE_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

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
