import { graphqlRequest } from "./api";

// Obtner todos los fraccionamientos (GraphQL)
export const obtenerFraccionamientos = async () => {
    const query = `
        query MyQuery {
            qr_shield_frac(where: {id: {_is_null: false}}) {
                id
                name
                location
                description
                iot_devices {
                access_group {
                    id
                    name
                    qr_entry {
                    data
                    }
                    qr_exit {
                    data
                    }
                }
                device_name
                serial_number
                }
            }
        }
    `;
    const response = await graphqlRequest(query);

    //console.log("Respuesta GraphQL:", response.data.qr_shield_frac); // 👈 Verifica qué devuelve la API
    return response?.data?.qr_shield_frac || [];

};
