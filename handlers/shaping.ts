import { v4 as uuidv4 } from "uuid";
import {  APIGatewayProxyResult } from 'aws-lambda';

enum SweetShape {
  Square = "Square",
  Circle = "Circle",
  Triangle = "Triangle",
}

enum SweetName {
  SweetiePie = "Sweetie Pie",
  LollyPop = "Lolly Pop",
  GummyBear = "Gummy Bear",
  JellyBean = "Jelly Bean",
  CandyCane = "Candy Cane",
}

interface SweetInput {
  ingredient: string;
  quantity: number;
}

interface SweetOutput {
  name: SweetName;
  shape: SweetShape;
  quantity: number;
}

export const handler = async(event: SweetInput[]): Promise<APIGatewayProxyResult> => {

    await new Promise(function(resolve){
        setTimeout(resolve, 5000)
    });

    const batchId = uuidv4();

    const shapedSweets: SweetOutput[] = event.map(
        function(sweet: SweetInput){
            return {
                shape: Object.values(SweetShape)[Math.floor(Math.random() * Object.values(SweetShape).length)],
                name: Object.values(SweetName)[Math.floor(Math.random() * Object.values(SweetShape).length)],
                quantity: sweet.quantity

            }
        }
    )

    return {
        statusCode: 200,
        body: {
            status: "success",
            batchId,
            shapedSweets,
        },
    };





}