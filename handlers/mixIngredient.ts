import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const getRandomMixingTime = () => {
    const minTime = 10;
    const maxTime = 360;

    return Math.floor(Math.random() * (maxTime - minTime + 1) + minTime);
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const mixingTime = getRandomMixingTime();


    return {
        statusCode: 200,
        body:{
            mixingTime: mixingTime
        }
    }
}
