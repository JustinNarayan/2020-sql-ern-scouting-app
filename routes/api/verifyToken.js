/// Middleware function to verify a JSON Web Token
const jwt = require("jsonwebtoken");
let keys;
try {
   keys = require("../../config/keys");
} catch (err) {
   // Module does not exist
}
const jsonKey = process.env.JSONKEY || keys.jsonKey;

module.exports = (req, res, next) => {
   // Get token from bearer header
   const bearerHeader = req.headers["authorization"];
   if (typeof bearerHeader !== "undefined") {
      const token = bearerHeader.split(" ")[1];
      jwt.verify(token, jsonKey, (err, auth) => {
         if (err)
            res.send({
               status: "Forbidden",
               message: "Invalid authorization key - please sign in",
            });
         else {
            req.auth = auth;
            next();
         }
      });
   } else {
      res.send({
         status: "Forbidden",
         message: "Missing authorization key - please sign in",
      });
   }
};
