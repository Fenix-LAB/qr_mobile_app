const API_URL = ""; // Reemplaza con la URL de tu API
const API_GRAPHQL_URL = "https://hashura.redinmex.com/v1/graphql"; // Reemplaza con la URL de tu API GraphQL

// Función genérica para hacer peticiones REST
export const apiRequest = async (endpoint: string, method = "GET", body: any = null) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) throw new Error("Error en la solicitud");

    return await response.json();
  } catch (error) {
    console.error("Error en la API:", error);
    throw error;
  }
};

// Función genérica para GraphQL
// export const graphqlRequest = async (query: string, variables: any = {}) => {
//   try {
//     const response = await fetch(`${API_URL}/graphql`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query, variables }),
//     });

//     if (!response.ok) throw new Error("Error en la consulta GraphQL");

//     const data = await response.json();
//     return data.data;
//   } catch (error) {
//     console.error("Error en la API GraphQL:", error);
//     throw error;
//   }
// };

export const graphqlRequest = async (query: string) => {
    try {
      const response = await fetch(API_GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": "api-dev-2014",
        },
        body: JSON.stringify({ query }),
      });
  
      const data = await response.json();
      
      // console.log("Respuesta completa de Hasura:", data); // 🔍 Verificar estructura de respuesta
  
      return data;
    } catch (error) {
      console.error("Error en la petición GraphQL:", error);
      return null;
    }
  };
  
