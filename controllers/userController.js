
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// ========================================
// GENERATE ACCESS TOKEN
// ========================================

const generateAccessToken = (user) => {

    return jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );

};


// ========================================
// GENERATE REFRESH TOKEN
// ========================================

const generateRefreshToken = (user) => {

    return jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );

};


// ========================================
// REGISTER
// ========================================

const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;


        // Check required fields
        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, email and password are required"
            });

        }


        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }


        // Hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );


        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });


        await user.save();


        // Generate tokens
        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);


        // Save refresh token
        user.refreshToken = refreshToken;

        await user.save();


        // Response
        res.status(201).json({

            message: "User registered successfully",

            accessToken,

            refreshToken,

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });


    } catch (error) {

        console.error("Error registering user:", error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

};


// ========================================
// LOGIN
// ========================================

const login = async (req, res) => {

    try {

        const { email, password } = req.body;


        // Check required fields
        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }


        // Find user
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "Invalid credentials"
            });

        }


        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid credentials"
            });

        }


        // Generate tokens
        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);


        // Save refresh token
        user.refreshToken = refreshToken;

        await user.save();


        // Response
        res.status(200).json({

            message: "Login successful",

            accessToken,

            refreshToken,

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });


    } catch (error) {

        console.error("Error logging in:", error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

};


// ========================================
// REFRESH ACCESS TOKEN
// ========================================

const refreshAccessToken = async (req, res) => {

    try {

        const { refreshToken } = req.body;


        // Check refresh token
        if (!refreshToken) {

            return res.status(401).json({
                message: "Refresh token is required"
            });

        }


        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );


        // Find user
        const user = await User.findById(decoded.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        // Check stored refresh token
        if (user.refreshToken !== refreshToken) {

            return res.status(401).json({
                message: "Invalid refresh token"
            });

        }


        // Generate new access token
        const newAccessToken = generateAccessToken(user);


        // Generate new refresh token
        const newRefreshToken = generateRefreshToken(user);


        // Replace old refresh token
        user.refreshToken = newRefreshToken;

        await user.save();


        res.status(200).json({

            message: "Access token refreshed",

            accessToken: newAccessToken,

            refreshToken: newRefreshToken

        });


    } catch (error) {

        console.error("Refresh token error:", error);

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });

    }

};


// ========================================
// LOGOUT
// ========================================

const logout = async (req, res) => {

    try {

        // req.user comes from auth.js
        const user = await User.findById(req.user.id);


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        // Remove refresh token
        user.refreshToken = null;

        await user.save();


        res.status(200).json({
            message: "Logout successful"
        });


    } catch (error) {

        console.error("Logout error:", error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

};

// ========================================
// UPLOAD PROFILE PICTURE
// ========================================

const uploadProfilePic = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a profile picture"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        profilePic: req.file.path
      },
      {
        new: true
      }
    ).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      user
    });

  } catch (error) {
    next(error);
  }
};
//=========================================


// ========================================
// GET ALL USERS
// ========================================

const getUsers = async (req, res) => {

    try {

        // Don't return password or refresh token
        const users = await User
            .find()
            .select("-password -refreshToken");


        if (!users.length) {

            return res.status(200).json({
                message: "NO USER OR USERS YET"
            });

        }


        res.status(200).json({

            message: "Users retrieved successfully",

            users

        });


    } catch (error) {

        console.error("Error retrieving users:", error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

};


// ========================================
// GET USER BY ID
// ========================================

const getUserById = async (req, res) => {

    try {

        const user = await User
            .findById(req.params.id)
            .select("-password -refreshToken");


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        res.status(200).json({

            message: "User retrieved successfully",

            user

        });


    } catch (error) {

        console.error("Error retrieving user:", error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

};


// ========================================
// CREATE USER
// ========================================

const createUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;


        // Check required fields
        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, email and password are required"
            });

        }


        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }


        // Hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );


        // Create user
        const user = new User({

            name,

            email,

            password: hashedPassword

        });


        await user.save();


        res.status(201).json({

            message: "User created successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });


    } catch (error) {

        console.error("Error creating user:", error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

};


// ========================================
// UPDATE USER
// ========================================

const updateUser = async (req, res) => {

    try {

        const updates = {
            ...req.body
        };


        // Prevent refresh token from being changed
        delete updates.refreshToken;


        // Hash password if password is being updated
        if (updates.password) {

            const salt = await bcrypt.genSalt(10);

            updates.password = await bcrypt.hash(
                updates.password,
                salt
            );

        }


        const user = await User
            .findByIdAndUpdate(
                req.params.id,
                updates,
                {
                    new: true,
                    runValidators: true
                }
            )
            .select("-password -refreshToken");


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        res.status(200).json({

            message: "User updated successfully",

            user

        });


    } catch (error) {

        console.error("Error updating user:", error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

};


// ========================================
// DELETE USER
// ========================================

const deleteUser = async (req, res) => {

    try {

        const user = await User.findByIdAndDelete(
            req.params.id
        );


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        res.status(200).json({

            message: "User deleted successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });


    } catch (error) {

        console.error("Error deleting user:", error);

        res.status(500).json({
            message: "Internal server error"
        });

    }

};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {

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

};
