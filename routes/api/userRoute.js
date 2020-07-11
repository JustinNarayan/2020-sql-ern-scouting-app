/// Define API routes for users database

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let keys;
try {
   keys = require("../../config/keys");
} catch (err) {
   // Module does not exist
}
const uuid = require("uuid");
const verifyToken = require("./verifyToken");

// Create small utility functions
const fix = (str) => str.replace(/['",`\\;]/g, "\\$&");

// Set up mail client
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const transport = nodemailer.createTransport(
   smtpTransport({
      name: "hostgator",
      host: process.env.EMAIL_HOST || keys.email.host,
      port: parseInt(process.env.EMAIL_PORT, 10) || keys.email.port,
      ignoreTLS: true,
      tls: { rejectUnauthorized: false },
      secure: true,
      auth: {
         user: process.env.EMAIL_USER || keys.email.user,
         pass: process.env.EMAIL_PASS || keys.email.pass,
      },
   })
);
const composeEmail = ({
   username,
   teamNumber,
   password,
   adminKey,
   email,
   verifyID,
}) => {
   const verifyLink = `https://www.testing.team7558.com/verify?verifyID=${verifyID}`;
   const sendOptions = {};
   sendOptions.from = {
      name: "Alt-F4's Scouting and Strategy Department",
      address: process.env.EMAIL_USER || keys.email.user,
   };
   sendOptions.to = email;
   sendOptions.bcc = process.env.EMAIL_USER || keys.email.user;
   sendOptions.subject = "Account Registered at scouting.team7558.com!";
   sendOptions.text =
      `Hello ${username} from Team ${teamNumber}!\n\n` +
      `Thank you for registering an account with scouting.team7558.com! To use our web application for gathering and using your own scouting data, please verify your account at this link: ${verifyLink}\n\n` +
      `Please take note of your account information, as it cannot be changed later:\n\n` +
      `Username: ${username}\n` +
      `Password: ${password}\n` +
      `Admin Key: ${adminKey}\n` +
      `Email: ${email}\n` +
      `Team Number: ${teamNumber}\n\n` +
      `Thank you again for registering and we hope you'll be scouting soon!\n\n` +
      `- Alt-F4's Scouting and Strategy Department`;
   return sendOptions;
};

// Export Routes
module.exports = (pool) => {
   // Attempt Login
   router.post("/login", async (req, res) => {
      // Analyze request
      const { username, password } = req.body; // Lowercase letters denote JS info

      // Handle response and track error source locations
      let errMessage;
      try {
         // Find user in database
         let sql = `SELECT Username, Password, TeamNumber, Verified from users WHERE Username = ?`;
         errMessage = "Failed to contact database";
         const [result] = await pool.execute(sql, [username]);

         // User may not exist
         errMessage = "That username is not registered";
         if (!result.length)
            throw `No user in our database has a username ${username}`;

         // Get user data
         const { Username, Password, TeamNumber, Verified } = result[0]; // Capital letters denote SQL info

         // Check password
         errMessage = "Failed to check against registered password";
         const passMatch = await bcrypt.compare(password, Password);
         errMessage = "Incorrect password";
         if (!passMatch) throw `The password for user ${username} is not that`;

         // Check verification
         errMessage =
            "Please verify your account through the email we sent at your registration";
         if (!Verified) throw `Account of user ${username} is not verified`;

         // Generate token
         const user = {
            username: Username,
            teamNumber: TeamNumber,
            isAdmin: true, //DEBUG
         };
         errMessage = "Failed to generate authentication token";
         const token = jwt.sign({ user }, process.env.JSONKEY || keys.jsonKey, {
            expiresIn: process.env.AUTHEXPIRY || keys.authExpiry,
         });

         // Success!
         res.send({
            message: "Login successful",
            type: "good",
            token,
         });
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   // Insert User
   router.post("/register", async (req, res) => {
      // Analyze request
      const { username, teamNumber, password, adminKey, email } = req.body;

      // Handle response and track error source locations
      let errMessage;
      try {
         // Hash password
         errMessage = "Failed to hash password";
         const hashedPassword = await bcrypt.hash(
            password,
            parseInt(process.env.SALT, 10) || keys.salt
         );

         // Hash admin key
         errMessage = "Failed to hash admin key";
         const hashedAdminKey = await bcrypt.hash(
            password,
            parseInt(process.env.SALT, 10) || keys.salt
         );

         // Check if username exists
         let sql = `SELECT Username FROM users WHERE Username = ?`;
         errMessage = "Failed to contact database";
         const [result] = await pool.execute(sql, [username]);

         // Username may exist
         errMessage = "That username is taken";
         if (result.length)
            throw `Duplicate usernames are not permissible in database`;

         // Send verification email
         const verifyID = uuid.v4();
         const sendOptions = composeEmail({
            username,
            teamNumber,
            password,
            adminKey,
            email,
            verifyID,
         });
         errMessage = "Failed to send email";
         await transport.sendMail(sendOptions);

         // Insert user into database
         sql = `INSERT INTO users (Username, Password, AdminKey, Email, TeamNumber, VerifyID, Verified) VALUES (?, ?, ?, ?, ?, ?, 0)`;
         errMessage =
            "Verification email sent but registration failed - please register again";
         await pool.execute(sql, [
            username,
            hashedPassword,
            hashedAdminKey,
            email,
            teamNumber,
            verifyID,
         ]);

         // Success!
         res.status(201).send({
            message:
               "Verification email successfully sent - please follow instructions in email",
            type: "good",
         });
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   // Verify user
   router.post("/verify/:id", async (req, res) => {
      // Analyze request
      const { id } = req.params;
      const { username, password } = req.body; // Lowercase letters denote JS info

      // Handle response and track error source locations
      let errMessage;
      try {
         // Find user in database
         let sql = `SELECT Username, Password, TeamNumber, Verified from users WHERE Username = ? AND VerifyID = ?`;
         errMessage = "Failed to contact database";
         const [result] = await pool.execute(sql, [username, fix(id)]);

         // User may not exist
         errMessage = "Invalid username and/or verification link";
         if (!result.length)
            throw `User ${username} and verify ID ${id} do not match`;

         // Get user data
         const { Password, Verified } = result[0]; // Capital letters denote SQL info

         // Check password
         errMessage = "Failed to check against registered password";
         const passMatch = await bcrypt.compare(password, Password);
         errMessage = "Incorrect password";
         if (!passMatch) throw `The password for user ${username} is not that`;

         // Check current verification status
         if (Verified) {
            res.send({ message: "Account already verified", type: "good" });
            return;
         }

         // Update data
         sql = `UPDATE users SET Verified = 1 WHERE Username = ?`;
         errMessage = "Failed to update verification status";
         const [nextResult] = await pool.execute(sql, [username]);

         // May have found no data
         errMessage = "Found no user data to update";
         if (!nextResult.affectedRows)
            throw `User ${username} not found in the database`;

         // Success!
         res.send({
            message: "Successfully updated verification status",
            type: "good",
         });
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   // Attempt Admin Login
   router.post("/admin", verifyToken, async (req, res) => {
      // Analyze request
      const { username } = req.auth.user;
      const { adminKey } = req.body; // Lowercase letters denote JS info

      // Handle response and track error source locations
      let errMessage;
      try {
         // Find user in database
         let sql = `SELECT Username, AdminKey, TeamNumber FROM users WHERE Username = ?`;
         errMessage = "Failed to contact database";
         const [result] = await pool.execute(sql, [username]);

         // User may not exist
         errMessage = "That username is not registered";
         if (!result.length)
            throw `No user in our database has a username ${username}`;

         // Get user data
         const { Username, AdminKey, TeamNumber } = result[0]; // Capital letters denote SQL info

         // Check password
         errMessage = "Failed to check against registered admin key";
         const passMatch = await bcrypt.compare(adminKey, AdminKey);
         errMessage = "Incorrect admin key";
         if (!passMatch) throw `The admin key for user ${username} is not that`;

         // Generate token
         const user = {
            username: Username,
            teamNumber: TeamNumber,
            isAdmin: true,
         };
         errMessage = "Failed to generate authentication token";
         const token = jwt.sign({ user }, process.env.JSONKEY || keys.jsonKey, {
            expiresIn: process.env.AUTHEXPIRY || keys.authExpiry,
         });

         // Success!
         res.send({
            message: "Login successful",
            type: "good",
            token,
         });
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   return router;
};
