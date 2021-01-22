module.exports.onFalsy = function onFalsy(value, callback) {
  if (!value) {
    if (!callback) throw Error("Invalid value provided");
    callback();
  }
  return value;
};

module.exports.eventPromise = function eventPromise(
  object,
  event,
  method = "once"
) {
  return new Promise((resolve) => {
    object[method](event, function () {
      resolve();
    });
  });
};

module.exports.ensureValid =
  /**
   * @param {{mongoDoc:import("mongoose").Document,res:import("express").Response},error:string} param0
   */
  async function ensureValid({ mongoDoc, res, error = "Invalid data" }) {
    try {
      await mongoDoc.validate();
      return true;
    } catch (e) {
      res.send({ error });
      return false;
    }
  };

const relationDict = {
  mother: "child",
  father: "child",
  child: "parent",
  son: "parent",
  daughter: "parent",
  "grand father": "grand child",
  "grand mother": "grand child",
  uncle: "nephew/neice",
  aunt: "nephew/neice",
  brother: "brother/sister",
  sister: "brother/sister",
  nephew: "uncle/aunt",
  neice: "aunt",
};
module.exports.getOtherRelation = function getOtherRelation(relation) {
  return relationDict[relation.toLowerCase()] || relation;
};

function _findPaths(fullGraph, from, to, validPaths, pendingPath) {
  const nextPath = fullGraph[from.id];
  if (!nextPath) return validPaths;
  const fromObj = { id: from.id, relation: from.relation };
  for (const { id, relation } of nextPath) {
    const nextObj = { id, relation };
    const path = pendingPath ? [...pendingPath, fromObj] : [fromObj];
    if (path.find((x) => x.id === id)) {
      continue;
    }
    if (String(id) === String(to.id)) {
      path.push(nextObj);
      validPaths.push(path);
      continue;
    }
    _findPaths(fullGraph, nextObj, to, validPaths, path);
  }

  return validPaths;
}
module.exports.findPathOptions = function findPathOptions({
  fullGraph,
  from,
  to,
}) {
  return _findPaths(fullGraph, from, to, [], null);
};
