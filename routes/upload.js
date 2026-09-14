const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const {
  uploadProfilePic
} = require("../controllers/userController");

router.post(
  "/profile-pic/:id",
  auth,
  upload.single("file"),
  uploadProfilePic
);

module.exports = router;