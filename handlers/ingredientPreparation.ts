import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


const dynamoDB = new DynamoDB.DocumentClient();
const tableName = process.env.INVENTORY_TABLE || "ingredients"


interface Ingredient{
    ingredient: string,
    quantity: number
}


export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  console.log("event", event)
  console.log("=================")
  const requiredIngredients: Ingredient[] = JSON.parse(
    event.body
  ).requiredIngredients;



  const insufficientIngredients = await Promise.all(
    requiredIngredients.map(async (ingredient) => {
      const result = await dynamoDB
        .get({
          TableName: tableName,
          Key: { ingredient: ingredient.ingredient },
        })
        .promise();

      if (!result.Item || result.Item.quantity < ingredient.quantity) {
        return {
          ingredient: ingredient.ingredient,
          quantity:
            ingredient.quantity - (result.Item ? result.Item.quantity : 0),
        };
      }

      await dynamoDB
        .update({
          TableName: tableName,
          Key: { ingredient: ingredient.ingredient },
          UpdateExpression: "SET quantity = :newQuantity",
          ExpressionAttributeValues: {
            ":newQuantity": result.Item.quantity - ingredient.quantity,
          },
        })
        .promise();

      return null;
    })
  );

  const filteredInsufficientIngredients = insufficientIngredients.filter(
    (item) => item !== null
  );

  if (filteredInsufficientIngredients.length === 0) {
    return {
      statusCode: 200,
      body: {
        status: "success",
        ingredients: requiredIngredients,
      },
    };
  } else {
    return {
      statusCode: 400,
      body: {
        status: "insufficient",
        insufficientIngredients: filteredInsufficientIngredients,
      },
    };
  }
};
