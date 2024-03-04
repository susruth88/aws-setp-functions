import { APIGatewayProxyResult } from 'aws-lambda';

import {  SecretsManager } from 'aws-sdk';
import { log } from 'console';

const secretsManager = new SecretsManager();


interface Sweet {
  shape: string;
  name: string;
  quantity: number;
}
interface Event {
  statusCode: number;
  body: {
    status: string;
    batchId: string;
    shapedSweets: Sweet[];
  };
}


export const handler = async (event: Event): Promise<APIGatewayProxyResult> => {

    try{

        const secretName = process.env.SECRET_NAME;

        const data = await secretsManager
            .getSecretValue({ SecretId: secretName })
            .promise();

        const secretValue: string[] = JSON.parse(data.SecretString)

        const invalidShapes: Sweet[] = [];

        for (const sweet of event.body.shapedSweets) {
            if (!secretValue.includes(sweet.shape)) {
                invalidShapes.push(sweet);
            }
        }

        if (invalidShapes.length > 0) {
            throw new Error(
                `Invalid shapes: ${invalidShapes
                .map((sweet) => sweet.shape)
                .join(", ")}`
            );
        }

        return { validShapes: true };

    }catch(error){
        console.log(error)
        throw error
    }

}

