import { graphqlRequestStrawberry } from "./api";

export const scannerCode = async (fracNameame: string, userId: number) => {
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