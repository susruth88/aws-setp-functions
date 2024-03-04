import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { validate as uuidValidate } from "uuid";


export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const batchId = event.body?.batchId

    if (batchId && uuidValidate(batchId)) {
            return { validApiQualityCheck: true };
    } else {
        throw new Error("Quality check failed: invalid batch ID");
    }

}
