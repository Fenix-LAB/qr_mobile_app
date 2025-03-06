import { apiRequest, graphqlRequest } from "./api";

// Obtener todos los usuarios (GraphQL)
export const obtenerUsuarios = async (frac_id: number) => {
  const query = `
    query MyQuery {
        qr_shield_user_frac_association(where: {frac_id: {_eq: ${frac_id}}}) {
            user {
                name
            }
        }
        }
  `;
    const response = await graphqlRequest(query);
    return response?.data?.qr_shield_user_frac_association || [];
};

