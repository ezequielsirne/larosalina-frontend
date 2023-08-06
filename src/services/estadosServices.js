import { urlbase } from './params.js';

export async function getEstados(token) {
    
    const endpoint = '/api/estados';
    const url = urlbase + endpoint;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
  
      const data = await response.json();
      
      return data;
    } catch (error) {
      // Procesar el error aquí
      console.error(error);
      throw error;
    }
  }