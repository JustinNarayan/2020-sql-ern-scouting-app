/// Define API routes for users database

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const keys = require("../../config/keys");
const { salt, jsonKey, authExpiry, email } = keys;

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
               if (result.length) {
                  res.status(409).send({
                     message: "A user with that username already exists",
                  });
               } else {
                  // Send database query
                  let sql = `INSERT INTO users (Username, Password, AdminKey, Email, TeamNumber, VerifyID, Verified) VALUES ('${req.body.username}', '${passHash}', '${keyHash}', '${req.body.email}', '${req.body.teamNumber}', '${req.body.verifyID}', 0)`;
                  db.query(sql, (err) => {
                     if (err) {
                        res.status(404).send(err);
                     }

                     // Send email
                     const sendOptions = mailOptions;
                     sendOptions.to = req.body.email;
                     sendOptions.subject =
                        "Account Registered at scouting.team7558.com!";
                     sendOptions.text = req.body.username;
                     transport.sendMail(sendOptions, (err, info) => {
                        if (err)
                           res.status(404).send({
                              message: "Failed to send email",
                              err,
                           });
                        else {
                           res.status(201).send(info);
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
