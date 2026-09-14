
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

    // Get Authorization header
    const authHeader = req.header("Authorization");

    // Check if token exists
    if (!authHeader) {
        return res.status(401).json({
            message: "No token, authorization denied"
        });
    }

    // Expected format:
    // Authorization: Bearer <accessToken>

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            message: "Authorization format must be Bearer <token>"
        });
    }

    const token = parts[1];

    try {

        // Verify access token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded user information
        req.user = decoded;

        // Continue to protected route
        next();

    } catch (error) {

        return res.status(401).json({
            message: "Token is not valid or has expired"
        });

    }
};



// const jwt = require("jsonwebtoken");

// module.exports = function(req, res, next) {
//   const token = req.header("Authorization");
//   if (!token) return res.status(401).json({ message: "No token, authorization denied" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id: user._id }
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Token is not valid" });
//   }
// 