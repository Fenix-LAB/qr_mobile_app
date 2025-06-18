import { graphqlRequest } from "./api";

// Obyener todos los IOT devices disponibbles (GraphQL)
export const obtenerDispositivosDisponibles = async () => {
    const query = `
        query MyQuery {
            qr_shield_iot_device(where: {frac_id: {_is_null: true}}) {
                id
                device_name
                serial_number
            }
        }

    `;
    const response = await graphqlRequest(query);

    //console.log("Respuesta GraphQL:", response.data.qr_shield_iot_device); // 👈 Verifica qué devuelve la API
    return response?.data?.qr_shield_iot_device || [];
}

// Crear nuevo acceso
export const crearAcceso = async (name: string, iot_device_id: string, frac_id: number) => {
    const mutation = `
        mutation MyMutation {
            insert_qr_shield_access_group(objects: {frac_id: ${frac_id}, iot_device_id: ${iot_device_id}, name: "${name}"}) {
                returning {
                id
                }
            }
        }
    `;
    const response = await graphqlRequest(mutation);

    //console.log("Respuesta GraphQL:", response.data.insert_qr_shield_iot_device); // 👈 Verifica qué devuelve la API
    return response?.data?.insert_qr_shield_access_group || null;
}

// Obtener nombre del fraccionamiento
export const obtenerNombreFraccionamiento = async (frac_id: number) => {
    const query = `
        query MyQuery {
            qr_shield_frac(where: {id: {_eq: ${frac_id}}}) {
                name
            }
        }
    `;
    const response = await graphqlRequest(query);

    //console.log("Respuesta GraphQL:", response.data.qr_shield_frac); // 👈 Verifica qué devuelve la API
    return response?.data?.qr_shield_frac[0] || null;
}
