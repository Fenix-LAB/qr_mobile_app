import { graphqlRequestStrawberry } from "./api";

export const scannerRequestAccess = async (fracNameame: string, userId: number) => {
    const query = `
        mutation MyMutation {
            qrRequestAccess(fracName: "${fracNameame}", userId: ${userId}) {
                message
                statusCode
            }
        }
    `;
    
    const response = await graphqlRequestStrawberry(query);
    
    return response;
    }