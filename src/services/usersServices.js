import { useEffect, useState } from 'react';
import { urlbase } from './params.js';
import swal from 'sweetalert';

export default async function login(nick, password) {
    const endpoint = '/api/users/login';
    const url = urlbase + endpoint;

    const data = {
      nick: nick,
      password: password
    };
  
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });    
        
        if (response.ok) {
            const responseData = await response.json();
            return responseData;
          } else {
            // Si la respuesta no es exitosa, maneja el caso de error
            const errorResponseData = await response.json();
            swal("Uy!", errorResponseData.errorMessages[0], "error")
            throw new Error('Error en la solicitud');
          }          

    } catch (error) {        
        throw new Error('Error en la solicitud');
    }
}

export async function getByToken(token) {
    
    const endpoint = '/api/users/getbytoken';
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

  export function useTokenExpiration(expirationDate, handleLogout) {

    const intervalo = 10*1000; //intervalo en segundos
    const flag = new Date().toLocaleTimeString();

    useEffect(() => {
      const checkTokenExpiration = () => {
        if (expirationDate) {
          const expirationTime = new Date(expirationDate).getTime();
          const currentTime = new Date().getTime();
  
          if (currentTime > expirationTime) {
            handleLogout();
          }
        }
      };
  
      console.log(expirationDate)
      // Ejecutar la comprobación inicial al montar el componente
        checkTokenExpiration();

  }, [expirationDate, handleLogout, flag]); 

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, intervalo)); 

      flag = new Date().toLocaleTimeString(); // Actualizar el valor después del intervalo fijado
    };

    fetchData();
  }, [flag]);
}