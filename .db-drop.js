require("dotenv").config();

const a = require("./models").wait();

a.then((x) => {
  return x.dropDatabase().then(console.log);
}).then(() => process.exit(0));
