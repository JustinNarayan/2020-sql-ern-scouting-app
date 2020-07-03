/// Define API routes for users database

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const keys = require("../../config/keys");
const { salt, jsonKey, authExpiry, email } = keys;
const uuid = require("uuid");
const validator = require("email-validator");

// Set up mail client
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const transport = nodemailer.createTransport(
   smtpTransport({
      name: "hostgator",
      host: email.host,
      port: email.port,
      ignoreTLS: true,
      tls: { rejectUnauthorized: false },
      secure: true,
      auth: {
         user: email.user,
         pass: email.pass,
      },
   })
);
const mailOptions = {
   from: email.user,
   to: "",
   subject: "",
   text: "",
};

// Export Routes
module.exports = (db) => {
   // Attempt Login
   router.post("/login", (req, res) => {
      let sql = `SELECT Username, Password, TeamNumber, Verified FROM users WHERE Username = '${req.body.username}' LIMIT 1`;

      db.query(sql, (err, result) => {
         if (err) {
            res.status(404).send(err);
         }

         // Check if username exists
         if (!result.length) {
            res.status(404).send({
               message: "That username is not registered",
            });
         } else {
            // Get user object
            const sqlUser = result[0];

            // Check password
            bcrypt.compare(
               req.body.password,
               sqlUser.Password,
               (err, result) => {
                  if (err)
                     res.status(404).send({
                        message: "Failed to check against password",
                        err,
                     });

                  // Check if password authenticated
                  if (!result) {
                     res.status(404).send({
                        message: "Incorrect password",
                     });
                  } else {
                     // Check if verified
                     if (!sqlUser.Verified) {
                        res.status(403).send({
                           message:
                              "User not verified, please see email in associated inbox to verify account",
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
                           jsonKey,
                           { expiresIn: authExpiry },
                           (err, token) => {
                              if (err)
                                 res.status(404).send({
                                    message:
                                       "Failed to generate authentication token",
                                    err,
                                 });
                              res.status(200).send({
                                 message: "Token successfully generated",
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
         }

         // Check if username exists
         if (!result.length) {
            res.status(404).send({
               message: "Invalid username and/or verification ID",
            });
         } else {
            // Get user object
            const sqlUser = result[0];

            // Check password
            bcrypt.compare(
               req.body.password,
               sqlUser.Password,
               (err, result) => {
                  if (err)
                     res.status(404).send({
                        message: "Failed to check against password",
                        err,
                     });

                  // Check if password authenticated
                  if (!result) {
                     res.status(404).send({
                        message: "Incorrect password",
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
                                 err,
                              });
                           }
                           res.status(200).send({
                              message: "Successfully verified account",
                           });
                        });
                     } else {
                        res.status(200).send({
                           message: "Account already verified",
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
      bcrypt.hash(plainPass, salt, (passErr, passHash) => {
         if (passErr)
            res.status(404).send({
               message: "Failed to hash password",
               err: passErr,
            });

         bcrypt.hash(plainKey, salt, (keyErr, keyHash) => {
            if (keyErr)
               res.status(404).send({
                  message: "Failed to hash admin key",
                  err: keyErr,
               });

            // Check if username exists
            let sql = `SELECT Username FROM users WHERE Username = '${req.body.username}' LIMIT 1`;
            db.query(sql, (err, result) => {
               if (err) {
                  res.status(404).send(err);
               }

               // Check for valid email
               if (!validator.validate(req.body.email)) {
                  res.status(400).send({ message: "Invalid email" });
               }
               // Check for duplicate username
               else if (result.length) {
                  res.status(409).send({
                     message: "A user with that username already exists",
                  });
               }
               // Send database insertion query
               else {
                  const verifyID = uuid.v4();
                  let sql = `INSERT INTO users (Username, Password, AdminKey, Email, TeamNumber, VerifyID, Verified) VALUES ('${req.body.username}', '${passHash}', '${keyHash}', '${req.body.email}', '${req.body.teamNumber}', '${verifyID}', 0)`;
                  db.query(sql, (err) => {
                     if (err) {
                        res.status(404).send(err);
                     }

                     const verifyLink = `https://www.testing.team7558.com?verifyID=${verifyID}`;
                     const sendOptions = mailOptions;
                     sendOptions.to = req.body.email;
                     sendOptions.subject =
                        "Account Registered at scouting.team7558.com!";
                     sendOptions.text = `Hello ${req.body.username} from Team ${req.body.teamNumber}!\n
                     Thank you for registering an account with scouting.team7558.com! To use our web application for gathering and using your own scouting data, please verify your account at this link: ${verifyLink}\n
                     Please take note of your account information, as it cannot be changed later:
                     Username: ${req.body.username}
                     Password: ${req.body.password}
                     Admin Key: ${req.body.adminKey}
                     Email: ${req.body.email}
                     Team Number: ${req.body.teamNumber}\n
                     Thank you again for registering and we hope you'll be scouting soon!
                     - Alt-F4's Scouting and Strategy Department`;

                     transport.sendMail(sendOptions, (err, info) => {
                        if (err)
                           res.status(404).send({
                              message: "Failed to send email",
                              err,
                              info,
                           });
                        else {
                           res.status(201).send({
                              message: "Verification email successfully sent",
                           });
                        }
                     });
                  });
               }
            });
         });
      });
   });

   return router;
};
