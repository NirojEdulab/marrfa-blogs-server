const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        const errorMessage =
          err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
        console.log("Token expired...");
        
        return res.status(403).json({ message: errorMessage });
      }

      // Assign decoded payload to req.user
      req.user = decoded;
      next();
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Authentication failed", error: error.message });
  }
};
