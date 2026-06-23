const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  // If we don't get any value for role, it will be set to "user" by default
  const { username, email, password, role = "user" } = req.body;

  // Problem: This checks an AND condition
  //   const alreadyExists = await userModel.findOne({
  //     username: username,
  //     email: email,
  //   });

  const alreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  // If it already exists, we will return a 409 status code which means conflict
  if (alreadyExists) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // If doesn't exist, we will create a new user
  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  // We will create a JWT token for the user
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );

  // We will send the token in a cookie
  res.cookie("token", token);

  // We will also send the user details in the response
  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

// Login user
async function loginUser(req, res) {
  // We will get the username/email and password from the request body
  const { username, email, password } = req.body;

  // We will find the user by username or email
  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  // If user doesn't exist, we will return a 401 status code which means unauthorized
  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // User bycrypt.compare() method is used to compare the plain text password with the hashed password stored in the database. It returns a boolean value indicating whether the passwords match or not.
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // If the credentials are valid, we will create a JWT token for the user
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  // We will also send the user details in the response
  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

async function logoutUser(req, res) {
  // Clear the token cookie
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully",
  });
}

module.exports = {
  registerUser,
  loginUser,
};
