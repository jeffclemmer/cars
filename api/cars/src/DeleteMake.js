const Validate = require("../helpers/Validate");

module.exports = async (event) => {
  // validate incoming data
  Validate.string(event.queryStringParameters.makes, { message: "makes" });

  let makes = event.queryStringParameters.makes.split(",");

  for (let i in makes) {
    await event.dynamo
      .delete({
        TableName: "Cars",
        Key: {
          cid: "123456",
          make: makes[i],
        },
      })
      .promise();
  }

  return "+";
};
