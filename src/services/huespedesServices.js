import { useEffect, useState } from 'react';
import { urlbase } from './params.js';

export async function getHuespedes(token) {
    
  const endpoint = `/api/huespedes`;
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

export async function getHuespedesByReserva(id, token) {
    
  const endpoint = `/api/huespedes/${id}`;
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

export async function getHuesped(id, token) {
    
  const endpoint = `/api/huespedes/huesped/${id}`;
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

    console.log(data)
    return data;
  } catch (error) {
    // Procesar el error aquí
    console.error(error);
    throw error;
  }
}

export async function addHuesped(token, huesped) {
  const endpoint = '/api/huespedes';
  const url = urlbase + endpoint;
 
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(huesped)
  });

  if (response.status === 204) {
    // La reserva se actualizó correctamente
    return true;
  } else if (response.status === 404) {
    // La reserva no se encontró
    console.log(response)
    throw new Error('Huesped no encontrado');
    
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

export async function updateHuesped(token, huesped) {
  const endpoint = '/api/huespedes';
  const url = urlbase + endpoint;
 
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(huesped)
  });

  if (response.status === 204) {
    // La reserva se actualizó correctamente
    return true;
  } else if (response.status === 404) {
    // La reserva no se encontró
    console.log(response)
    throw new Error('Huesped no encontrado');
    
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

export async function deleteHuesped(token, huesped) {
  const endpoint = '/api/huespedes';
  const url = urlbase + endpoint;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(huesped)
  });

  if (response.status === 204) {
    // La reserva se actualizó correctamente
    return true;
  } else if (response.status === 404) {
    // La reserva no se encontró
    console.log(response)
    throw new Error('Huesped no encontrado');
    
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

