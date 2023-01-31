const express = require("express");
const passport = require("passport");
const router = express.Router();
const ChatObject = require("../models/chat");
const SERVER_ERROR = "SERVER_ERROR";

// route for get all chat
router.get("/all", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const data = await ChatObject.find({ organisation: req.user.organisation });
    console.log("data messages =>", data);
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

// route for create new message in chat collection
router.post("/new", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    console.log({ content: req.body.content, organisation: req.user.organisation, name: req.user.name });
    const data = await ChatObject.create({ content: req.body.content, organisation: req.user.organisation, name: req.user.name });
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

module.exports = router;
