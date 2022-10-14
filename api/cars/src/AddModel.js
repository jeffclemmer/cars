const Validate = require("../helpers/Validate");
const Filter = require("../helpers/Filter");

module.exports = async (event) => {
  let rec = JSON.parse(Filter.xss(event.body));

  // validate incoming data
  Validate.string(rec.make, { message: "make" });
  Validate.string(rec.model, { message: "model" });
  Validate.string(rec.year, { message: "year" });
  Validate.string(rec.type, { message: "type" });
  Validate.string(rec.engine, { message: "engine" });

  const make = await event.dynamo
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

  // we sort going in, so we don't have to sort everytime coming out
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
  await event.dynamo
    .put({
      TableName: "Cars",
      Item: make.Item,
    })
    .promise();

  return "+";
};

// a quick helper function that doesn't take itself too seriously :-D
function makeId() {
  return Math.ceil(Math.random() * 10000).toString();
}
