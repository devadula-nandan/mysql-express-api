const jwt = require("jsonwebtoken");

// Generate a JWT token for the given user object
exports.generateToken = (data) => {
  const { email, id } = data;
  const token = jwt.sign({ email: email, id: id }, process.env.JWT_SECRET,{ expiresIn: '30d' });
  return token;
};

// Verify the JWT token and add the user object to the request object
exports.verifyToken = (req, res, next) => {
  // Get the token from the request header
  const token = req.headers.authorization?.replace("Bearer ", "");
  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { email: decoded.email, id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: "unauthorised" });
  }
};
