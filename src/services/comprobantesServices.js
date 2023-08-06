import { urlbase } from './params.js';

export async function getComprobantesByGasto(idGasto, token) {
    
  const endpoint = `/api/comprobantes/gasto/${idGasto}`;
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

export async function getComprobantesByMovimiento(idMovimiento, token) {
    
  const endpoint = `/api/comprobantes/movimiento/${idMovimiento}`;
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

export async function getComprobantesByReserva(idReserva, token) {
    
  const endpoint = `/api/comprobantes/reserva/${idReserva}`;
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

export async function getComprobantes(id, token) {
    
  const endpoint = `/api/comprobantes/${id}`;
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

export async function addComprobantes(token, comprobantes, idMovimiento) {

  const endpoint = `/api/comprobantes/${idMovimiento}`;
  const url = urlbase + endpoint;
  
  const formData = new FormData();

  comprobantes.forEach((file) => {
    formData.append('comprobantes', file);
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
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

export async function deleteComprobante(token, comprobante) {
  const endpoint = '/api/comprobantes';
  const url = urlbase + endpoint;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(comprobante)
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

