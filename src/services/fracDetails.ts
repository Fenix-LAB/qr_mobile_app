import { graphqlRequest } from "./api";

// Obtener detalles de un fraccionamiento por ID
export const obtenerFraccionamientoPorId = async (id: number) => {
    const query = `
        query MyQuery {
            qr_shield_frac(where: {id: {_eq: ${id}}}) {
                id
                name
                location
                description
                iot_devices {
                access_group {
                    name
                    qr_entry {
                    data
                    }
                    qr_exit {
                    data
                    }
                    id
                }
                device_name
                serial_number
                id
                }
                id
            }
        }
    `;
    const response = await graphqlRequest(query);

    return response?.data?.qr_shield_frac || {};
};

// actualizarFraccionamiento
export const actualizarFraccionamiento = async (id: number, name: string, location: string, description: string) => {
    const mutation = `
        mutation MyMutation {
            update_qr_shield_frac_by_pk(pk_columns: {id: ${id}}, _set: {name: "${name}", location: "${location}", description: "${description}"}) {
                id
                name
                location
                description
            }
        }
    `;
    const response = await graphqlRequest(mutation);

    return response?.data?.update_qr_shield_frac_by_pk || null;
};