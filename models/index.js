const mongoose = require("mongoose");

const { onFalsy, eventPromise } = require("../util");

module.exports.wait = function () {
  mongoose.connect(onFalsy(process.env.DATABASE_URL), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  const db = mongoose.connection;

  return eventPromise(db, "open").then(() => {
    return db;
  });
};
