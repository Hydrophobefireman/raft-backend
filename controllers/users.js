const { ensureValid, getOtherRelation, onFalsy } = require("../util");
const Users = require("../models/Users");

async function createUser(name, res, { shouldSave } = { shouldSave: true }) {
  const user = new Users({ name });
  if (!(await ensureValid({ mongoDoc: user, res, error: "Invalid user" }))) {
    return;
  }
  shouldSave && user.save();

  return user;
}

module.exports.create =
  /** @type {import("express").RequestHandler} */
  async (req, res) => {
    const name = req.params.name;
    const user = await createUser(name, res);
    if (!user) return;
    return res.send({ data: user.toJSON() });
  };
module.exports.addConnection =
  /**
   * @type {import("express").RequestHandler}
   */
  async (req, res) => {
    constoptions = { upsert: true, new: true };
    const {
      protagonistId,
      relation,
      relative: { relativeId, relativeName },
    } = req.body;

    const cb = () => res.send({ error: "Invalid data" });
    const r = onFalsy(relation, cb);
    if (!r) return;
    const otherRelation = getOtherRelation(r);
    /** @type {import("mongoose").Document<any>} */
    let relative;
    /**@type {import("mongoose").Document<any>} */

    if (!relativeId) {
      relative = await createUser(relativeName, res);
      if (!relative) return;
    } else {
      relative = onFalsy(await Users.findById(relativeId), () =>
        res.send("relative user does not exist")
      );
      if (!relative) return;
    }

    try {
      if (await relative.isConnectedTo(protagonistId)) {
        return res.send({ error: "People are already connected!" });
      }
      const protagonist = await Users.findById(protagonistId);
      protagonist.connections.push({ id: relative.id, relation });
      relative.connections.push({ id: protagonistId, relation: otherRelation });
      await protagonist.save();
      await relative.save();
    } catch (e) {
      console.log(e);
      return res.send({ error: "unknown error" });
    }
    return res.send({ data: true });
  };

module.exports.getUsers = /** @type {import("express").RequestHandler} */ async (
  req,
  res
) => {
  const { users } = req.body;

  if (
    !onFalsy(users && users.length, () =>
      res.send({ error: "No users provided" })
    )
  )
    return;

  const ret = await Users.find({ _id: { $in: users } }, { __v: false });
  return res.send({ data: ret });
};

module.exports.all = async function (req, res) {
  try {
    const all = await Users.find({});
    return res.send({ data: all });
  } catch (e) {
    res.send({ error: "could not fetch users" });
  }
};
