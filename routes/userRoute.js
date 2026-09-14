
const express = require("express");

const router = express.Router();


// Controllers
const {
    register,
    login,
    refreshAccessToken,
    logout,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    uploadProfilePic
} = require("../controllers/userController");

const upload = require("../middleware/upload");


// Authentication middleware
const auth = require("../middleware/auth");


// ========================================
// AUTH ROUTES
// ========================================

// Register a new user
router.post("/register", register);

// Login
router.post("/login", login);

// Get a new access token
router.post("/refresh", refreshAccessToken);

// Logout
router.post("/logout", auth, logout);


// ========================================
// USER CRUD ROUTES
// ========================================

// Create user
router.post("/", createUser);

// Get all users
router.get("/", getUsers);

// Get user by ID
router.get("/:id", getUserById);

// Update user by ID
router.put("/:id", updateUser);

// Delete user by ID
router.delete("/:id", deleteUser);

//profile picture upload route
router.post(
  "/profile-pic/:id",
  auth,
  upload.single("file"),
  uploadProfilePic
);

module.exports = router;
