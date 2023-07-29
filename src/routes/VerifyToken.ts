const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("authHeader,", authHeader);
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).send("Token is invalid");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).send("You are not authenticated.");
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).send("You are not allow to do that.");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
};
