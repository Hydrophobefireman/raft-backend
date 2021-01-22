const Users = require("../models/Users");
const { findPathOptions } = require("../util");

module.exports.getAffinity = /** @type {import("express").RequestHandler} */ async (
  req,
  res
) => {
  const { from, to } = req.params;
  if (from === to || !from || !to) return res.send({ error: "Invalid values" });

  try {
    const [fromUser, toUser] = await Promise.all([
      Users.findById(from),
      Users.findById(to),
    ]);
    if (!fromUser || !toUser) {
      return res.send({
        error: "user does not exist",
      });
    }
    const allUsers = await Users.find({});
    const obj = {};
    allUsers.forEach((x) => {
      obj[x.id] = x.connections;
    });

    return res.send({
      data: findPathOptions({ fullGraph: obj, from: fromUser, to: toUser }),
    });
  } catch (e) {
    console.log(e);
    return res.send({ error: "Could not find affinities" });
  }
};
