const { Router } = require("express");
const users = require("../controllers/users");
const router = new Router();

router.get("/create/:name", users.create);
router.post("/connections/add", users.addConnection);
router.post("/by-id", users.getUsers);
router.get("/all", users.all);

module.exports = router;
