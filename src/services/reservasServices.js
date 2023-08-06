import { urlbase } from './params.js';

export async function getReservas(token) {
    
  const endpoint = '/api/reservas';
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

export async function getReserva(id, token) {
    
  const endpoint = `/api/reservas/${id}`;
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

export async function addReserva(token, reserva) {
  const endpoint = '/api/reservas';
  const url = urlbase + endpoint;

  console.log(reserva)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reserva)
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

export async function updateReserva(token, reserva) {
  const endpoint = '/api/reservas';
  const url = urlbase + endpoint;
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reserva)
  });

  if (response.status === 204) {
    // La reserva se actualizó correctamente
    return true;
  } else if (response.status === 404) {
    // La reserva no se encontró
    console.log(response)
    throw new Error('Reserva no encontrada');
    
  } else if (response.status === 401) {
    // No autorizado (token inválido o expirado)
    console.log(response)
    throw new Error('No autorizado');
  } else {
    // Otro error en el servidor
    console.log(response)
    throw new Error('Error en el servidor');
  }
}

export async function deleteReserva(token, reserva) {
  const endpoint = '/api/reservas';
  const url = urlbase + endpoint;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reserva)
  });

  if (response.status === 204) {
    // La reserva se actualizó correctamente
    return true;
  } else if (response.status === 404) {
    // La reserva no se encontró
    console.log(response)
    throw new Error('Gasto no encontrado');
    
  } else if (response.status === 401) {
    // No autorizado (token inválido o expirado)
    console.log(response)
    throw new Error('No autorizado');
  } else {
    // Otro error en el servidor
    console.log(response)
    throw new Error('Error en el servidor');
  }
}


export async function getIndicadores(token) {
    
    const endpoint = '/api/reservas/indicadores';
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
  
      const data = await response?.json();
      
      return data;
    } catch (error) {
      // Procesar el error aquí
      console.error(error);
      throw error;
    }
  }

  export async function getEnConflicto(token) {
    
    const endpoint = '/api/reservas/enconflicto';
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
