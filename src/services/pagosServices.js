import { urlbase } from './params.js';

export async function getPagos(id, token) {
    
  const endpoint = `/api/pagos/${id}`;
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

export async function addPago(token, movimiento) {
  const endpoint = '/api/pagos';
  const url = urlbase + endpoint;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(movimiento)
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Procesar el error aquí
    console.error(error);
    throw new Error(error);
  }
}
