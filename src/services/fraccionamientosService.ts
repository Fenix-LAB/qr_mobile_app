import { apiRequest, graphqlRequest } from "./api";

// Obtener todos los fraccionamientos (REST)
export const obtenerFraccionamientos = async () => {
  return await apiRequest("/fraccionamientos");
};

// Registrar un fraccionamiento (REST)
export const registrarFraccionamiento = async (nombre: string) => {
  return await apiRequest("/fraccionamientos", "POST", { nombre });
};

// Obtener fraccionamientos con GraphQL
export const obtenerFraccionamientosGraphQL = async () => {
  const query = `
    query {
      fraccionamientos {
        id
        nombre
      }
    }
  `;
  return await graphqlRequest(query);
};

// Obtener fraccionamientos por usuario
// export const obtenerFraccionamientosUsuario = async (userId: number) => {
//     const query = `
//       query MyQuery($userId: Int!) {
//         qr_shield_user_frac_association(where: { user_id: { _eq: $userId } }) {
//           frac {
//             name
//             description
//             location
//           }
//         }
//       }
//     `;

//     console.log('userId', userId);
//     return await graphqlRequest(query, { userId });
//   };

export const obtenerFraccionamientosUsuario = async (userId: number) => {
  const query = `
    query MyQuery {
      qr_shield_user_frac_association(where: {user_id: {_eq: ${userId}}}) {
        frac {
          name
          description
          location
        }
      }
    }
  `;

  // console.log("Consulta GraphQL:", query); // 👈 Verifica si se está enviando correctamente

  const response = await graphqlRequest(query);

  // console.log("Respuesta GraphQL:", response); // 👈 Verifica qué devuelve la API

  return response?.data?.qr_shield_user_frac_association?.map((item: any) => item.frac) || [];
};

export const obtenerFraccionamientoActual = async (userId: number) => {
  const query = `
  query MyQuery {
  qr_shield_user(distinct_on: current_frac_id, where: {id: {_eq: ${userId}}}) {
    frac {
      id
      name
      description
      location
    }
  }
}
  `;

  const response = await graphqlRequest(query);

  return response?.data?.qr_shield_user[0] || [];
};

export const obtenerFraccionamientosUsurio = async (userId: number) => {
  const query = `
    query MyQuery {
    qr_shield_user_frac_association(where: {user_id: {_eq: ${userId}}}) {
      frac {
        name
        description
        location
        id
      }
    }
  }
  `;
  const response = await graphqlRequest(query);

  return response?.data?.qr_shield_user_frac_association || [];
};

export const actulizarFraccionamientoActualUsuario = async (userId: number, fracId: number) => {
  const query = `
  mutation MyMutation {
  update_qr_shield_user(where: {id: {_eq: ${userId}}}, _set: {current_frac_id: ${fracId}}) {
    affected_rows
    returning {
      current_frac_id
    }
  }
}
  `;

  const response = await graphqlRequest(query);

  console.log("Respuesta GraphQL:", response); // 👈 Verifica qué devuelve la API

  return response?.data?.update_qr_shield_user || [];
}

export const obtenerTodosFraccionamientos = async () => {
  const query = `
    query MyQuery {
    qr_shield_frac {
      description
      location
      name
    }
  }
  `;

  const response = await graphqlRequest(query);

  return response?.data?.qr_shield_frac || [];
};
