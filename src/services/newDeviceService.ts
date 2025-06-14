import { graphqlRequest } from "./api";

// Obtener todos los dispositivos IoT (GraphQL)
export const obtenerDispositivosIoT = async () => {
    const query = `
        query MyQuery {
            qr_shield_iot_device(limit: 1, order_by: {id: desc}) {
                id
            }
        }
    `;
    const response = await graphqlRequest(query);

    //console.log("Respuesta GraphQL:", response.data.qr_shield_iot_device); // 👈 Verifica qué devuelve la API
    return response?.data?.qr_shield_iot_device || [];
}

// Crear nuevo device
export const crearDispositivoIoT = async (device_name: string, device_type: string, serial_number: string) => {
    const mutation = `
        mutation MyMutation {
            insert_qr_shield_iot_device(objects: {device_name: "${device_name}", device_type: "${device_type}", serial_number: "${serial_number}"}) {
                returning {
                id
                }
            }
        }
    `;
    const response = await graphqlRequest(mutation);

    //console.log("Respuesta GraphQL:", response.data.insert_qr_shield_iot_device_one); // 👈 Verifica qué devuelve la API
    return response?.data?.insert_qr_shield_iot_device || null;
}

