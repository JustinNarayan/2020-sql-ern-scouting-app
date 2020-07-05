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

// Set up mail client
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const transport = nodemailer.createTransport(
   smtpTransport({
      name: "hostgator",
      host: process.env.EMAIL_HOST || keys.email.host,
      port: process.env.EMAIL_HOST || keys.email.port,
      ignoreTLS: true,
      tls: { rejectUnauthorized: false },
      secure: true,
      auth: {
         user: process.env.EMAIL_HOST || keys.email.user,
         pass: process.env.EMAIL_HOST || keys.email.pass,
      },
   })
);
const mailOptions = {
   from: process.env.EMAIL_HOST || keys.email.user,
   to: "",
   subject: "",
   text: "",
};

// Export Routes
module.exports = (db) => {
   // Attempt Login
   router.post("/login", (req, res) => {
      if (!req.body.username || !req.body.password) {
         res.send({ message: "Please fill out all fields", type: "bad" });
         return;
      }

      let sql = `SELECT Username, Password, TeamNumber, Verified FROM users WHERE Username = '${req.body.username}' LIMIT 1`;

      db.query(sql, (err, result) => {
         if (err) {
            res.status(404).send(err);
            return;
         }

         // Check if username exists
         if (!result.length) {
            res.send({
               message: "That username is not registered",
               type: "bad",
            });
         } else {
            // Get user object
            const sqlUser = result[0];

            // Check password
            bcrypt.compare(
               req.body.password,
               sqlUser.Password,
               (err, result) => {
                  if (err) {
                     res.status(404).send({
                        message: "Failed to check against password",
                        type: "bad",
                        err,
                     });
                     return;
                  }

                  // Check if password authenticated
                  if (!result) {
                     res.send({
                        message: "Incorrect password",
                        type: "bad",
                     });
                  } else {
                     // Check if verified
                     if (!sqlUser.Verified) {
                        res.send({
                           message:
                              "User not verified, please see email in associated inbox to verify account",
                           type: "bad",
                        });
                     } else {
                        /* Handle Token Authentication */
                        const user = {
                           username: sqlUser.Username,
                           teamNumber: sqlUser.TeamNumber,
                        };
                        // Generate authentication token
                        jwt.sign(
                           { user },
                           process.env.JSONKEY || keys.jsonKey,
                           {
                              expiresIn:
                                 process.env.AUTHEXPIRY || keys.authExpiry,
                           },
                           (err, token) => {
                              if (err) {
                                 res.status(404).send({
                                    message:
                                       "Failed to generate authentication token",
                                    type: "bad",
                                    err,
                                 });
                                 return;
                              }
                              res.send({
                                 message: "Token successfully generated",
                                 type: "good",
                                 token,
                              });
                           }
                        );
                     }
                  }
               }
            );
         }
      });
   });

   // Verify user
   router.post("/verify/:id", (req, res) => {
      let sql = `SELECT Username, Password, Verified FROM users WHERE Username = '${req.body.username}' AND VerifyID = '${req.params.id}' LIMIT 1`;

      db.query(sql, (err, result) => {
         if (err) {
            res.status(404).send(err);
            return;
         }

         // Check if username exists
         if (!result.length) {
            res.send({
               message: "Invalid username and/or verification ID",
               type: "bad",
            });
         } else {
            // Get user object
            const sqlUser = result[0];

            // Check password
            bcrypt.compare(
               req.body.password,
               sqlUser.Password,
               (err, result) => {
                  if (err) {
                     res.status(404).send({
                        message: "Failed to check against password",
                        type: "bad",
                        err,
                     });
                     return;
                  }

                  // Check if password authenticated
                  if (!result) {
                     res.send({
                        message: "Incorrect password",
                        type: "bad",
                     });
                  } else {
                     // Check if verified
                     if (!sqlUser.Verified) {
                        let sql = `UPDATE users SET Verified = 1 WHERE Username = '${req.body.username}'`;
                        db.query(sql, (err) => {
                           if (err) {
                              res.status(400).send({
                                 message:
                                    "Failed to update verification status",
                                 type: "bad",
                                 err,
                              });
                              return;
                           }
                           res.send({
                              message: "Successfully verified account",
                              type: "good",
                           });
                        });
                     } else {
                        res.send({
                           message: "Account already verified",
                           type: "good",
                        });
                     }
                  }
               }
            );
         }
      });
   });

   // Insert User
   router.post("/register", (req, res) => {
      const plainPass = req.body.password;
      const plainKey = req.body.adminKey;

      // Generate hashed passwords
      bcrypt.hash(
         plainPass,
         process.env.SALT || keys.salt,
         (passErr, passHash) => {
            if (passErr) {
               res.status(404).send({
                  message: "Failed to hash password",
                  type: "bad",
                  err: passErr,
               });
               return;
            }

            bcrypt.hash(
               plainKey,
               process.env.SALT || keys.salt,
               (keyErr, keyHash) => {
                  if (keyErr) {
                     res.status(404).send({
                        message: "Failed to hash admin key",
                        type: "bad",
                        err: keyErr,
                     });
                     return;
                  }

                  // Check if username exists
                  let sql = `SELECT Username FROM users WHERE Username = '${req.body.username}' LIMIT 1`;
                  db.query(sql, (err, result) => {
                     if (err) {
                        res.status(404).send(err);
                        return;
                     }
                     // Check for duplicate username
                     else if (result.length) {
                        res.send({
                           message: "A user with that username already exists",
                           type: "bad",
                        });
                     }
                     // Send database insertion query
                     else {
                        const verifyID = uuid.v4();
                        let sql = `INSERT INTO users (Username, Password, AdminKey, Email, TeamNumber, VerifyID, Verified) VALUES ('${req.body.username}', '${passHash}', '${keyHash}', '${req.body.email}', '${req.body.teamNumber}', '${verifyID}', 0)`;
                        db.query(sql, (err) => {
                           if (err) {
                              res.status(404).send(err);
                              return;
                           }

                           const verifyLink = `https://www.testing.team7558.com?verifyID=${verifyID}`;
                           const sendOptions = mailOptions;
                           sendOptions.to = req.body.email;
                           sendOptions.subject =
                              "Account Registered at scouting.team7558.com!";
                           sendOptions.text =
                              `Hello ${req.body.username} from Team ${req.body.teamNumber}!\n\n` +
                              `Thank you for registering an account with scouting.team7558.com! To use our web application for gathering and using your own scouting data, please verify your account at this link: ${verifyLink}\n\n` +
                              `Please take note of your account information, as it cannot be changed later:\n\n` +
                              `Username: ${req.body.username}\n` +
                              `Password: ${req.body.password}\n` +
                              `Admin Key: ${req.body.adminKey}\n` +
                              `Email: ${req.body.email}\n` +
                              `Team Number: ${req.body.teamNumber}\n\n` +
                              `Thank you again for registering and we hope you'll be scouting soon!\n\n` +
                              `- Alt-F4's Scouting and Strategy Department`;

                           transport.sendMail(sendOptions, (err, info) => {
                              if (err)
                                 res.send({
                                    message: "Failed to send email",
                                    type: "bad",
                                    err,
                                    info,
                                 });
                              else {
                                 res.status(201).send({
                                    message:
                                       "Verification email successfully sent",
                                    type: "good",
                                 });
                              }
                           });
                        });
                     }
                  });
               }
            );
         }
      );
   });

   return router;
};
