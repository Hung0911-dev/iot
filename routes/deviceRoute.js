const express = require("express");
const { registerDevice, findDevice, getDevice } = require("../controllers/deviceControllers")
const router = express.Router();

router.post("/register", registerDevice);
router.get("/find/:deviceId", findDevice);
router.get("/", getDevice);

module.exports = router;