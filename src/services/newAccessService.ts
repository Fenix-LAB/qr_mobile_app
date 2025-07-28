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
export const crearAcceso = async (name: string, iot_device_id: number, frac_id: number) => {
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

// Actualizar iot device para que pertenezca a un fraccionamiento
export const actualizarDispositivoIoT = async (iot_device_id: string, frac_id: number) => {
    const mutation = `
        mutation MyMutation {
            update_qr_shield_iot_device_by_pk(pk_columns: {id: ${iot_device_id}}, _set: {frac_id: ${frac_id}}) {
                id
            }
        }
    `;
    const response = await graphqlRequest(mutation);

    //console.log("Respuesta GraphQL:", response.data.update_qr_shield_iot_device_by_pk); // 👈 Verifica qué devuelve la API
    return response?.data?.update_qr_shield_iot_device_by_pk || null;
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


// Guardar el string del QR entrada y salida y asignar al acceso
export const saveQrEntryString = async (name: string, frac_id: number) => {
    const mutation = `
        mutation MyMutation {
            insert_qr_shield_qr_entry(objects: {data: "${name}", frac_id: ${frac_id}}) {
                returning {
                id
                }
            }
        }
    `;
    const response = await graphqlRequest(mutation);

    //console.log("Respuesta GraphQL:", response.data.insert_qr_shield_qr_entry); // 👈 Verifica qué devuelve la API
    return response?.data?.insert_qr_shield_qr_entry || null;   
}


// Guardar el string del QR salida y asignar al acceso
export const saveQrExitString = async (data: string, frac_id: number) => {
    const mutation = `
        mutation MyMutation {
            insert_qr_shield_qr_exit(objects: {data: "${data}", frac_id: ${frac_id}}) {
                returning {
                id
                }
            }
        }
    `;
    const response = await graphqlRequest(mutation);

    //console.log("Respuesta GraphQL:", response.data.insert_qr_shield_qr_exit); // 👈 Verifica qué devuelve la AP
    return response?.data?.insert_qr_shield_qr_exit || null;
}

// Vincular el acceso con los QR de entrada y salida
export const vincularAccesoConQrs = async (access_group_id: number, qr_entry_id: number, qr_exit_id: number) => {
    const mutation = `
        mutation MyMutation {
            update_qr_shield_access_group_by_pk(pk_columns: {id: ${access_group_id}}, _set: {qr_entry_id: ${qr_entry_id}, qr_exit_id: ${qr_exit_id}}) {
                id
            }
        }
    `;
    const response = await graphqlRequest(mutation);
    //console.log("Respuesta GraphQL:", response.data.update_qr_shield_access_group_by_pk); // 👈 Verifica qué devuelve la API
    return response?.data?.update_qr_shield_access_group_by_pk || null;
}