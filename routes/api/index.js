const router = require("express").Router();

const userRoutes = require("./user-routes");
const thougthsRoutes = require("./thoughts-routes");

router.use("/users", userRoutes);
router.use("/thoughts", thougthsRoutes);

module.exports = router;