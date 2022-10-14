const Validate = require("../helpers/Validate");

module.exports = async (event) => {
  // validate incoming data
  Validate.string(event.pathParameters.make, { message: "make" });
  Validate.string(event.queryStringParameters.models, { message: "models" });

  let make = await event.dynamo
    .get({
      TableName: "Cars",
      Key: {
        cid: "123456",
        make: event.pathParameters.make,
      },
    })
    .promise();

  let models = event.queryStringParameters.models.split(",");
  let save = make.Item.models.filter((item) => !models.includes(item.id));

  make.Item.models = save;

  // update db
  await event.dynamo
    .put({
      TableName: "Cars",
      Item: make.Item,
    })
    .promise();

  return "+";
};
