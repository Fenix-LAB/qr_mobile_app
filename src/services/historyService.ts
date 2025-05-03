import { apiRequest, graphqlRequest } from "./api";

// Obtener todos los historiales de un usuario (GraphQL)
export const obtenerHistorialesUsuario = async (userId: number) => {
  const query = `
    query MyQuery {
      qr_shield_event(where: {user_id: {_eq: ${userId}}}, limit: 10) {
        frac {
          name
          location
        }
        type
        datetime
      }
    }
    `;
    
  const response = await graphqlRequest(query);

//   console.log("Respuesta GraphQL:", response); // 👈 Verifica qué devuelve la API

  return response?.data?.qr_shield_event || [];
};
        