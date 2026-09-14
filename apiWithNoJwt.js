require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

//other import
const User = require("./models/User");


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

connectDB();

// log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// CRUD OPERATIONS FOR USERS

// users with NO logging and registration and jwt

//post a user
app.post('/api/v1/users', async (req, res) => {
    try {
        const user = new User(req.body);

        await user.save();

        res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        console.error("Error creating user:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// get all users
app.get('/api/v1/users', async (req, res) => {
    try {
        const users = await User.find();

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
});

// get a user by id
app.get('/api/v1/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User retrieved successfully", user });
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// update a user by id
app.put('/api/v1/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// delete a user by id
app.delete('/api/v1/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}); 

// handle errors    
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
}); 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});