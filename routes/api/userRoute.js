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
const fix = require("./sqlStringFix");

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
const mailOptions = {
   from: {
      name: "Alt-F4's Scouting and Strategy Department",
      address: process.env.EMAIL_USER || keys.email.user,
   },
   to: "",
   subject: "",
   text: "",
};

// Export Routes
module.exports = (db) => {
   // Attempt Login
   router.post("/login", (req, res) => {
      // Connect to pool
      db.getConnection((err, conn) => {
         if (err) {
            res.status(404).send(err);
            return;
         }

         // Run code
         let sql = `SELECT Username, Password, TeamNumber, Verified FROM users WHERE Username = '${fix(
            req.body.username
         )}' LIMIT 1`;

         conn.query(sql, (err, result) => {
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
                              isAdmin: false,
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
                                    message: "Login successful",
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
   });

   // Insert User
   router.post("/register", (req, res) => {
      // Connect to pool
      db.getConnection((err, conn) => {
         if (err) {
            res.status(404).send(err);
            return;
         }

         // Run code
         const plainPass = req.body.password;
         const plainKey = req.body.adminKey;

         // Generate hashed passwords
         bcrypt.hash(
            plainPass,
            parseInt(process.env.SALT, 10) || keys.salt,
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
                  parseInt(process.env.SALT, 10) || keys.salt,
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
                     let sql = `SELECT Username FROM users WHERE Username = '${fix(
                        req.body.username
                     )}' LIMIT 1`;
                     conn.query(sql, (err, result) => {
                        if (err) {
                           res.status(404).send(err);
                           return;
                        }
                        // Check for duplicate username
                        else if (result.length) {
                           res.send({
                              message:
                                 "A user with that username already exists",
                              type: "bad",
                           });
                        }
                        // Send verification email
                        else {
                           const verifyID = uuid.v4();
                           const verifyLink = `https://www.testing.team7558.com/verify?verifyID=${verifyID}`;
                           const sendOptions = mailOptions;
                           sendOptions.to = req.body.email;
                           sendOptions.bcc =
                              process.env.EMAIL_USER || keys.email.user;
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

                           // Send message
                           transport.sendMail(sendOptions, (err, info) => {
                              if (err)
                                 res.send({
                                    message: "Failed to send email",
                                    type: "bad",
                                    err,
                                    info,
                                 });
                              // Update database
                              else {
                                 let sql = `INSERT INTO users (Username, Password, AdminKey, Email, TeamNumber, VerifyID, Verified) VALUES ('${fix(
                                    req.body.username
                                 )}', '${passHash}', '${keyHash}', '${fix(
                                    req.body.email
                                 )}', '${
                                    req.body.teamNumber
                                 }', '${verifyID}', 0)`;

                                 conn.query(sql, (err) => {
                                    if (err) {
                                       // Email sent but account not registered
                                       res.send({
                                          message:
                                             "Verification email sent but registration failed - please register again",
                                          type: "bad",
                                       });
                                       return;
                                    }
                                    res.status(201).send({
                                       message:
                                          "Verification email successfully sent - please follow instructions in email",
                                       type: "good",
                                    });
                                 });
                              }
                           });
                        }
                     });
                  }
               );
            }
         );
      });
   });

   // Verify user
   router.post("/verify/:id", (req, res) => {
      // Connect to pool
      db.getConnection((err, conn) => {
         if (err) {
            res.status(404).send(err);
            return;
         }

         // Run code
         let sql = `SELECT Username, Password, Verified FROM users WHERE Username = '${req.body.username}' AND VerifyID = '${req.params.id}' LIMIT 1`;

         conn.query(sql, (err, result) => {
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
                           conn.query(sql, (err) => {
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
   });

   // Attempt Admin Login
   router.post("/admin", verifyToken, (req, res) => {
      // Connect to pool
      db.getConnection((err, conn) => {
         if (err) {
            res.status(404).send(err);
            return;
         }
         let sql = `SELECT Username, AdminKey, TeamNumber FROM users WHERE Username = '${fix(
            req.auth.user.username
         )}' LIMIT 1`;

         conn.query(sql, (err, result) => {
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
                  req.body.adminKey,
                  sqlUser.AdminKey,
                  (err, result) => {
                     if (err) {
                        res.status(404).send({
                           message: "Failed to check against admin key",
                           type: "bad",
                           err,
                        });
                        return;
                     }

                     // Check if password authenticated
                     if (!result) {
                        res.send({
                           message: "Incorrect admin key",
                           type: "bad",
                        });
                     } else {
                        /* Create a new authentication token with a new isAdmin value */
                        const user = {
                           username: sqlUser.Username,
                           teamNumber: sqlUser.TeamNumber,
                           isAdmin: true,
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
                                       "Failed to generate admin authentication token",
                                    type: "bad",
                                    err,
                                 });
                                 return;
                              }
                              res.send({
                                 message: "Admin authentication successful",
                                 type: "good",
                                 token,
                              });
                           }
                        );
                     }
                  }
               );
            }
         });
      });
   });

   return router;
};
