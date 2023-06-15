const express = require("express");
const router = express.Router();
const fs = require("fs");

const thisRoute = `${__dirname}`;

// eslint-disable-next-line array-callback-return
fs.readdirSync(thisRoute).filter((file) => {
  const removeExt = file.split(".").shift("");
  const sky = ["index"].includes(removeExt);

  if (!sky) {
    router.use(`/${removeExt}`, require(`./${removeExt}`));
  }
});

router.get("*", (req, res) => {
  res.status(404);
  res.send({ error: "not found" });
});

module.exports = router;
