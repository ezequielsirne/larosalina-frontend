import { urlbase } from './params.js';

export async function getIndicadores(token, request) {    
    const endpoint = '/api/informes/indicadores';
    const url = urlbase + endpoint;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }  
      const data = await response?.json();      
      return data;

    } catch (error) {
      // Procesar el error aquí
      console.error(error);
      throw new Error(error);
    }
}
  
export async function getEconomico(token, request) {    
    const endpoint = '/api/informes/economico';
    const url = urlbase + endpoint;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }  
      const data = await response?.json();      
      return data;

    } catch (error) {
      // Procesar el error aquí
      console.error(error);
      throw new Error(error);
    }
}
  
export async function getGastos(token, request) {    
    const endpoint = '/api/informes/gastos';
    const url = urlbase + endpoint;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }  
      const data = await response?.json();      
      return data;

    } catch (error) {
      // Procesar el error aquí
      console.error(error);
      throw new Error(error);
    }
}
  
export async function getFinanciero(token, request) {    
    const endpoint = '/api/informes/financiero';
    const url = urlbase + endpoint;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }  
      const data = await response?.json();      
      return data;

    } catch (error) {
      // Procesar el error aquí
      console.error(error);
      throw new Error(error);
    }
  }