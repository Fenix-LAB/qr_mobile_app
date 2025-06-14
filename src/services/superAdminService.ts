import { graphqlRequest } from "./api";

// Obtner todos los fraccionamientos (GraphQL)
export const obtenerFraccionamientos = async () => {
    const query = `
        query MyQuery {
            qr_shield_frac {
                id
                name
                location
                description
                iot_devices {
                id
                }
            }
        }
    `;
    const response = await graphqlRequest(query);

    //console.log("Respuesta GraphQL:", response.data.qr_shield_frac); // 👈 Verifica qué devuelve la API
    return response?.data?.qr_shield_frac || [];

};
