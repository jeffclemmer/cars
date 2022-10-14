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

// load events
const getMakes = require("./src/GetMakes");
const addMake = require("./src/AddMake");
const getModels = require("./src/GetModels");
const deleteMake = require("./src/DeleteMake");
const addModel = require("./src/AddModel");
const deleteModel = require("./src/DeleteModel");

// ternary to determine if we are we running dev or prod db
// AWS_SAM_LOCAL is passed as a string and not a bool
// console.log("process.env.AWS_SAM_LOCAL:", process.env.AWS_SAM_LOCAL);
// console.log(
//   "process.env.AWS_SAM_LOCAL typeof :",
//   typeof process.env.AWS_SAM_LOCAL
// );

const dynamo =
  process.env.AWS_SAM_LOCAL === "true"
    ? new AWS.DynamoDB.DocumentClient({
        endpoint: new AWS.Endpoint("http://carsdb:8000"),
      })
    : new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  // if developing locally, i'd like to see event variables in my terminal
  if (process.env.AWS_SAM_LOCAL === "true") {
    console.log("event:", JSON.stringify(event));
    console.log("event.routeKey:", JSON.stringify(event.routeKey));
    console.log("event.body:", JSON.stringify(event.body));
    console.log("event.queryStringParameters:", event.queryStringParameters);
    console.log("event.pathParameters:", event.pathParameters);
  }

  // add dynamo to the event object to pass into event handlers
  event.dynamo = dynamo;

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
    // list all makes
    if (event.routeKey == "GET /makes") {
      body = JSON.stringify(await getMakes(event));
    }

    // add make
    if (event.routeKey == "POST /add-make") {
      body = await addMake(event);
    }

    // list all models for a make
    if (event.routeKey == "GET /models/{make}") {
      body = await getModels(event);
    }

    // delete make
    if (event.routeKey == "GET /delete-make") {
      body = await deleteMake(event);
    }

    // add model
    if (event.routeKey == "POST /add-model") {
      body = await addModel(event);
    }

    // delete model
    if (event.routeKey == "GET /delete-model/{make}") {
      body = await deleteModel(event);
    }

    if (event.routeKey == "OPTIONS /{proxy+}") {
      body = "";
    } else if (body === "") {
      throw "route not handled";
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

// let event = {
//   routeKey: "GET /makes",
// };
// exports.handler(event);
