const Validate = require("../helpers/Validate");

module.exports = async (event) => {
  Validate.string(event.pathParameters.make, { message: "make" });

  const make = await event.dynamo
    .get({
      TableName: "Cars",
      Key: {
        cid: "123456",
        make: event.pathParameters.make,
      },
    })
    .promise();

  return JSON.stringify({
    dname: make.Item.dname,
    models: make.Item.models,
  });
};
