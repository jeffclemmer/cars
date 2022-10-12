/* 
DynamoDB table item definition:

Cars
{
  cid: [primary key] - is hard coded into the API, since this isn't a real app
  make: [sort key] string
  models: [
    {
      id: string,
      name: string,
      year: string,
      type: string,
      engine: string,
    },
    ...
  ]
}

*/

const AWS = require("aws-sdk");

// ternary to determine if we are we running dev or prod db
// let dynamo = null;
// AWS_SAM_LOCAL is passed as a string and not a bool
const dynamo =
  process.env.AWS_SAM_LOCAL === "true"
    ? new AWS.DynamoDB.DocumentClient({
        endpoint: new AWS.Endpoint("http://cars-app:8000"),
      })
    : new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  // console.log("event:", JSON.stringify(event));
  // console.log("event.routeKey:", JSON.stringify(event.routeKey));
  // console.log("event.body:", JSON.stringify(event.body));
  // console.log("event.queryStringParameters:", event.queryStringParameters);
  // console.log("event.pathParameters:", event.pathParameters);

  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    if (event.routeKey == "OPTIONS /{proxy+}") {
      body = "";
    }

    // list all makes
    if (event.routeKey == "GET /makes") {
      const makes = await dynamo
        .query({
          TableName: "Cars",
          KeyConditionExpression: "cid = :cid",
          ExpressionAttributeValues: {
            ":cid": "123456",
          },
          ProjectionExpression: "make, dname",
        })
        .promise();
      body = JSON.stringify(makes.Items);
    }

    // add make
    if (event.routeKey == "POST /add-make") {
      let rec = JSON.parse(event.body);
      await dynamo
        .put({
          TableName: "Cars",
          Item: {
            cid: "123456",
            make: rec.make,
            dname: rec.dname,
            models: [],
          },
        })
        .promise();

      body = "+";
    }

    // list all models for a make
    if (event.routeKey == "GET /models/{make}") {
      const make = await dynamo
        .get({
          TableName: "Cars",
          Key: {
            cid: "123456",
            make: event.pathParameters.make,
          },
        })
        .promise();

      body = JSON.stringify({
        dname: make.Item.dname,
        models: make.Item.models,
      });
    }

    // delete make
    if (event.routeKey == "GET /delete-make") {
      if (
        event.queryStringParameters &&
        "makes" in event.queryStringParameters
      ) {
        let makes = event.queryStringParameters.makes.split(",");

        for (let i in makes) {
          await dynamo
            .delete({
              TableName: "Cars",
              Key: {
                cid: "123456",
                make: makes[i],
              },
            })
            .promise();
        }
        body = "+";
      } else {
        body = "-";
      }
    }

    // add model
    if (event.routeKey == "POST /add-model") {
      let rec = JSON.parse(event.body);
      if (
        "make" in rec &&
        "model" in rec &&
        "year" in rec &&
        "type" in rec &&
        "engine" in rec
      ) {
        const make = await dynamo
          .get({
            TableName: "Cars",
            Key: {
              cid: "123456",
              make: rec.make,
            },
          })
          .promise();

        make.Item.models.push({
          id: makeId(),
          name: rec.model,
          year: rec.year,
          type: rec.type,
          engine: rec.engine,
        });

        make.Item.models.sort((a, b) => {
          const nameA = a.name.toUpperCase(); // ignore upper and lowercase
          const nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

        // update db
        await dynamo
          .put({
            TableName: "Cars",
            Item: make.Item,
          })
          .promise();
      }
    }

    // delete model
    if (event.routeKey == "GET /delete-model/{make}") {
      if (
        event.queryStringParameters &&
        "models" in event.queryStringParameters
      ) {
        let models = event.queryStringParameters.models.split(",");

        let make = await dynamo
          .get({
            TableName: "Cars",
            Key: {
              cid: "123456",
              make: event.pathParameters.make,
            },
          })
          .promise();

        let save = make.Item.models.filter((item) => !models.includes(item.id));

        make.Item.models = save;

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
    console.log("Error:", JSON.stringify(error));
    body = { error: error };
    statusCode = 500;
  }

  return {
    statusCode,
    body,
    headers,
  };
};

function makeId() {
  return Math.ceil(Math.random() * 10000).toString();
}
