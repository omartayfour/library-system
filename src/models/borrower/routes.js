const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.send("using API borrower routes");
});

module.exports = router;
