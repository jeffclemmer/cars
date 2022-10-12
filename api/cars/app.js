/* 
DynamoDB table item definition:

Cars
{
  make: [primary key] string
  models: {
    id: string,
    name: string,
    year: string,
    type: string,
    engine: string,
  }
}
*/

const AWS = require("aws-sdk");

// ternary to determine if we are we running dev or prod db
// let dynamo = null;
// AWS_SAM_LOCAL is passed as a string and not a bool
const dynamo =
  process.env.AWS_SAM_LOCAL === "true"
    ? new AWS.DynamoDB.DocumentClient({
        endpoint: new AWS.Endpoint("http://192.168.1.197:8000"),
      })
    : new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  console.log("event.routeKey:", event.routeKey);

  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,DELETE,OPTIONS",
    "Access-Control-Max-Age": "86400",
  };

  try {
    // list all makes
    if (event.routeKey == "GET /makes") {
      body = await dynamo.scan({ TableName: "Cars" }).promise();
      body = JSON.stringify(body.Items);
    }

    // list all models
    if (event.routeKey == "GET /models/{id}") {
      const make = await dynamo
        .get({
          TableName: "Cars",
          Key: {
            id: event.pathParameters.id,
          },
        })
        .promise();

      console.log("make:", make);
      body = JSON.stringify({ make: make.Item.make, models: make.Item.models });
    }

    // delete make
    if (event.routeKey == "DELETE /make/{id}") {
      await dynamo
        .delete({
          TableName: "Cars",
          Key: {
            id: event.pathParameters.id,
          },
        })
        .promise();
      body = "+";
    }

    // delete model
    if (event.routeKey == "DELETE /model/{makeId}/{modelId}") {
      let make = await dynamo
        .get({
          TableName: "Cars",
          Key: {
            id: event.pathParameters.makeId,
          },
        })
        .promise();

      let index = make.Item.models.findIndex(
        (item) => item.id === event.pathParameters.modelId
      );

      if (index != -1) {
        // remove item from models
        make.Item.models.splice(index, 1);

        // update db
        await dynamo
          .put({
            TableName: "Cars",
            Item: make.Item,
          })
          .promise();
      }

      body = "+";
    }
  } catch (error) {
    console.log("Error:", error);
    body = { error: error };
    statusCode = 500;
  }

  return {
    statusCode,
    body,
    headers,
  };
};
