const jwt = require("jsonwebtoken");
const User = require("../models/user");

require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        // res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    // res.redirect("/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, jwtSecret, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
      } else {
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// const checkSuperAdmin = (req, res, next) => {
//   const user = res.locals.user;

//   if (user && user.role === "Super_Admin") {
//     next();

//   } else {

//     res.status(403).json({
//       status: "error",
//       message: "You are not authorized to perform this action",
//     });

//   }
// };



/////////////////

const authMiddleware = (req, res, next) => {

  const token = req.cookies.jwt || req.headers.authorization;

  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {

      if (err) {

        res.status(401).json({ 
          status: 'error',
          message: 'Unauthorized: Invalid token' 
        });
      } else {

        req.user = decodedToken;
        next();
      }
    });
  } else {

    res.status(401).json({ 
      status: 'error',
      message: 'Unauthorized: No token provided' 
    });
  }
};

// Middleware function to check if the user has the required role
const checkRole = (requiredRole) => {
  return (req, res, next) => {

    const userRole = req.user.role;

    if (userRole === requiredRole) {

      next();
    } else {

      res.status(403).json({ 
        status: 'error', 
        message: 'Forbidden: Insufficient permissions' 
      });
    }
  };
};


module.exports = { requireAuth, checkUser, authMiddleware, checkRole };
