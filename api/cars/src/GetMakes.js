module.exports = async (event) => {
  const makes = await event.dynamo
    .query({
      TableName: "Cars",
      KeyConditionExpression: "cid = :cid",
      ExpressionAttributeValues: {
        ":cid": "123456",
      },
      ProjectionExpression: "make, dname",
    })
    .promise();

  return makes.Items;
};
