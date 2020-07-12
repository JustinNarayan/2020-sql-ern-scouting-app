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
   const sendOptions = {
      from: {
         name: "Alt-F4's Scouting and Strategy Department",
         address: process.env.EMAIL_USER || keys.email.user,
      },
      to: email,
      bcc: process.env.EMAIL_USER || keys.email.user,
      subject: "Account Registered at scouting.team7558.com!",
      text: "",
   };
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

/* EXPORT
   Function containing all API routes */

module.exports = (pool) => {
   /**
    * Login to the database
    * @body username (alphanumeric string)
    * @body password (string)
    */
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
         if (!result.length) throw "";

         // Get user data
         const { Username, Password, TeamNumber, Verified } = result[0]; // Capital letters denote SQL info

         // Check password
         errMessage = "Failed to check against registered password";
         const passMatch = await bcrypt.compare(password, Password);
         errMessage = "Incorrect password";
         if (!passMatch) throw "";

         // Check verification
         errMessage =
            "Please verify your account through the email we sent at your registration";
         if (!Verified) throw "";

         // Generate token
         const user = {
            username: Username,
            teamNumber: TeamNumber,
            isAdmin: false,
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

   /**
    * Registers a new user and sends a verification email
    * @body username (alphanumeric string)
    * @body teamNumber (1 <= int <= max FRC Team Number)
    * @body password (string)
    * @body adminKey (string)
    * @body email (valid email string)
    */
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
            adminKey,
            parseInt(process.env.SALT, 10) || keys.salt
         );

         // Check if username exists
         let sql = `SELECT Username FROM users WHERE Username = ?`;
         errMessage = "Failed to contact database";
         const [result] = await pool.execute(sql, [username]);

         // Username may exist
         errMessage = "That username is taken";
         if (result.length) throw "";

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

   /**
    * Verifies an existing user in the database
    * @params id (unique verification ID string)
    * @body username (alphanumeric string)
    * @body password (string)
    */
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
         if (!result.length) throw "";

         // Get user data
         const { Password, Verified } = result[0]; // Capital letters denote SQL info

         // Check password
         errMessage = "Failed to check against registered password";
         const passMatch = await bcrypt.compare(password, Password);
         errMessage = "Incorrect password";
         if (!passMatch) throw "";

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
         if (!nextResult.affectedRows) throw "";

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

   /**
    * Grants a user admin privileges with a correct admin key
    * @auth Bearer <token> (token received from login)
    * @body adminKey (string)
    */
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
         if (!result.length) throw "";

         // Get user data
         const { Username, AdminKey, TeamNumber } = result[0]; // Capital letters denote SQL info

         // Check password
         errMessage = "Failed to check against registered admin key";
         const passMatch = await bcrypt.compare(adminKey, AdminKey);
         console.log(adminKey);
         errMessage = "Incorrect admin key";
         if (!passMatch) throw "";

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
