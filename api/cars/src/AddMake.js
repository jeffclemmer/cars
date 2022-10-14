const Validate = require("../helpers/Validate");
const Filter = require("../helpers/Filter");

module.exports = async (event) => {
  let rec = JSON.parse(Filter.xss(event.body));

  Validate.string(rec.make, { message: "make" });
  Validate.string(rec.dname, { message: "dname" });

  await event.dynamo
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

  return "+";
};
