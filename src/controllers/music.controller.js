const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");
const albumModel = require("../models/album.model");

async function createMusic(req, res) {
  //   const token = req.cookies.token;

  //   if (!token) {
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }

  //   jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
  //     if (err) {
  //       return res.status(401).json({ message: "Unauthorized" });
  //     }

  //     if (decoded.role !== "artist") {
  //       return res
  //         .status(403)
  //         .json({ message: "You don't have access to create music" });
  //     }

  // Middleware now handles the above code, so we can directly access the decoded token in the request object
  const decoded = req.user;

  const { title } = req.body;
  const file = req.file;
  const result = await uploadFile(file.buffer.toString("base64"));

  const music = await musicModel.create({
    uri: result.url,
    title,
    artist: decoded.id,
  });

  return res.status(201).json({
    message: "Music created successfully",
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
    },
  });
  //   });
}

async function createAlbum(req, res) {
  //   const token = req.cookies.token;

  //   if (!token) {
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }

  //   jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
  //     if (err) {
  //       return res.status(401).json({ message: "Unauthorized" });
  //     }

  //     if (decoded.role !== "artist") {
  //       return res
  //         .status(403)
  //         .json({ message: "You don't have access to create albums" });
  //     }

  // Middleware now handles the above code, so we can directly access the decoded token in the request object
  const decoded = req.user;
  const { title, musics } = req.body;

  const album = await albumModel.create({
    title,
    artist: decoded.id,
    musics: musics, // Assuming you have an array of music IDs to associate with the album
  });

  return res.status(201).json({
    message: "Album created successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      musics: album.musics,
    },
  });
  //   });
}

async function getAllMusic(req, res) {
  const musics = await musicModel
    .find()
    .limit(2)
    .populate("artist", "username"); // Populate the artist field with only the name

  res.status(200).json({
    message: "All music retrieved successfully",
    musics,
  });
}

async function getAllAlbums(req, res) {
  const albums = await albumModel
    .find()
    .select("title artist")
    .populate("artist", "username"); // Populate the artist field with only the name

  res.status(200).json({
    message: "All albums retrieved successfully",
    albums,
  });
}

async function getAlbumById(req, res) {
  const { id } = req.params;
  const album = await albumModel
    .findById(id)
    .populate("artist", "username")
    .populate("musics", "title uri"); // Populate the artist field with only the name and musics with title and uri

  if (!album) {
    return res.status(404).json({ message: "Album not found" });
  }
  res.status(200).json({
    message: "Album retrieved successfully",
    album,
  });
}

module.exports = {
  createMusic,
  createAlbum,
  getAllMusic,
  getAllAlbums,
  getAlbumById,
};
