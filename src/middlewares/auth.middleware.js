const jwt = require("jsonwebtoken");

async function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (decoded.role !== "artist") {
      return res
        .status(403)
        .json({ message: "You don't have access to create music" });
    }

    req.user = decoded;
    next();
  });
}

async function authUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (decoded.role !== "artist" && decoded.role !== "user") {
      return res.status(403).json({ message: "Login to listen to music!" });
    }
    req.user = decoded;
    next();
  });
}

module.exports = {
  authenticateToken,
  authUser,
};
