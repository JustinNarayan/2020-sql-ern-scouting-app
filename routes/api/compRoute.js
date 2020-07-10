/// Define API routes for comps database

const express = require("express");
const router = express.Router();
const verifyToken = require("./verifyToken");
const fix = require("./sqlStringFix");

module.exports = (db) => {
   // Select Comps
   router.get("/", verifyToken, (req, res) => {
      let sql = `SELECT * FROM competitions WHERE Username = '${req.auth.user.username}' ORDER BY ID ASC`;
      db.query(sql, (err, rows) => {
         if (err) {
            res.status(404).send({
               message: "Failed to get competitions",
               type: "bad",
               err,
            });
         }
         res.send(rows);
      });
   });

   // Insert Comp
   router.post("/", verifyToken, (req, res) => {
      // Check if admin
      if (!req.auth.user.isAdmin) {
         res.send({
            message: "Missing admin privileges for that action",
            type: "bad",
         });
         return;
      }

      // Check if that name already exists
      let sql = `SELECT ID FROM competitions WHERE Username = '${
         req.auth.user.username
      }' AND CompetitionName = '${fix(req.body.competitionName)}'`;

      db.query(sql, (err, result) => {
         if (err) {
            res.status(404).send({
               message: "Failed to locate competitions data",
               type: "bad",
               err,
            });
         }
         if (result.length) {
            res.send({
               message: "A competition with that name already exists",
               type: "bad",
               result,
            });
         } else {
            // Now actually insert the new competition
            let sql = `INSERT INTO competitions (Username, CompetitionName) VALUES ('${
               req.auth.user.username
            }', '${fix(req.body.competitionName)}')`;

            db.query(sql, (err) => {
               if (err) {
                  res.status(404).send({
                     message: "Failed to create competition",
                     type: "bad",
                     err,
                  });
               }
               res.status(201).send({
                  message: "Successfully created new competition",
                  type: "good",
               });
            });
         }
      });
   });

   // Update Comp
   router.patch("/:id", verifyToken, (req, res) => {
      // Check if admin
      if (!req.auth.user.isAdmin) {
         res.send({
            message: "Missing admin privileges for that action",
            type: "bad",
         });
         return;
      }

      let sql = `UPDATE competitions SET CompetitionName = '${fix(
         req.body.competitionName
      )}' WHERE ID = '${req.params.id}' AND Username = '${
         req.auth.user.username
      }'`;
      db.query(sql, (err, result) => {
         if (err) {
            res.status(404).send({
               message: "Failed to update competition",
               type: "bad",
               err,
            });
         }
         if (result.affectedRows)
            res.send({
               message: "Successfully updated competition",
               type: "good",
               err,
            });
         else
            res.send({
               message: "Found no competition to update",
               type: "bad",
               err,
            });
      });
   });

   // Delete Comp
   router.delete("/:id", verifyToken, (req, res) => {
      // Check if admin
      if (!req.auth.user.isAdmin) {
         res.send({
            message: "Missing admin privileges for that action",
            type: "bad",
         });
         return;
      }

      let sql = `DELETE FROM competitions WHERE ID = '${req.params.id}' AND Username = '${req.auth.user.username}'`;
      db.query(sql, (err, result) => {
         if (err) {
            res.status(404).send({
               message: "Deleted aborted; failed to delete competition",
               type: "bad",
               err,
            });
         }
         if (result.affectedRows)
            res.send({
               message: "Successfully deleted ", // Would display 'Successfully deleted <CompetitionName> through the Home Component receiving the message
               type: "good",
               err: result,
            });
         else
            res.send({
               message: "Delete aborted; found no competition to delete",
               type: "bad",
               err,
            });
      });
   });

   return router;
};
