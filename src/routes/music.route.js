const express = require("express");
const musicController = require("../controllers/music.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const multer = require("multer");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/upload",
  upload.single("music"),
  authMiddleware.authenticateToken,
  musicController.createMusic,
);
router.post(
  "/album",
  authMiddleware.authenticateToken,
  musicController.createAlbum,
);

router.get("/", authMiddleware.authUser, musicController.getAllMusic);
router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums);
router.get(
  "/albums/:id",
  authMiddleware.authUser,
  musicController.getAlbumById,
);

module.exports = router;
