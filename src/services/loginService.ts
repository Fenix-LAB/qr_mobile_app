import { apiRequest, graphqlRequest } from "./api";

export const loginRequest = async (nombre: string) => {
    const query = `
        query MyQuery {
        qr_shield_user(where: {name: {_eq: "${nombre}"}}) {
            id
            role
            active
        }
        }
    `;
    
    const response = await graphqlRequest(query);
    
    // console.log("Respuesta GraphQL:", response); // 👈 Verifica qué devuelve la API
    
    return response?.data?.qr_shield_user || null;
    }