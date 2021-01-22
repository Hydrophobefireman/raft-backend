const { Router } = require("express");
const graph = require("../controllers/graph");
const router = new Router();

router.get("/affinity/:from/:to", graph.getAffinity);
module.exports = router;
