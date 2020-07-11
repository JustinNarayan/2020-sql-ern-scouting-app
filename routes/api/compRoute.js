/// Define API routes for comps database

const express = require("express");
const router = express.Router();
const verifyToken = require("./verifyToken");

// Create small utility functions
const fix = (str) => str.replace(/['",`\\;]/g, "\\$&");
const hasPrivileges = (isAdmin, res) =>
   isAdmin
      ? true
      : res.send({
           message: "Missing admin privileges for that action",
           type: "bad",
        });

module.exports = (pool) => {
   // Select Comps
   router.get("/", verifyToken, async (req, res) => {
      // Analyze request
      const { username } = req.auth.user;

      // Handle response and track error source locations
      let errMessage;
      try {
         // Query database for user's competitions
         let sql = `SELECT * FROM competitions WHERE Username = ? ORDER BY ID ASC`;
         errMessage = "Failed to get competitions";
         const [result] = await pool.execute(sql, [username]);
         res.send(result);
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   //

   // Insert Comp
   router.post("/", verifyToken, async (req, res) => {
      // Analyze request
      const { username, isAdmin } = req.auth.user;
      const { competitionName } = req.body;
      if (!hasPrivileges(isAdmin, res)) return;

      // Handle response and track error source locations
      let errMessage;
      try {
         // Check if this name is taken
         let sql = `SELECT * FROM competitions WHERE Username = ? AND CompetitionName = ?`;
         errMessage = "Failed to get competitions";
         const [result] = await pool.execute(sql, [
            username,
            fix(competitionName),
         ]);

         // Name may be taken
         errMessage = "That competition name is taken";
         if (result.length) throw "";

         // Insert Comp
         sql = `INSERT INTO competitions (Username, CompetitionName) VALUES (?, ?)`;
         errMessage = "Failed to create competition";
         await pool.execute(sql, [username, fix(competitionName)]);

         // Success!
         res.status(201).send({
            message: "Successfully created new competition",
            type: "good",
         });
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   //

   // Update Comp
   router.patch("/:id", verifyToken, async (req, res) => {
      // Analyze request
      const { username, isAdmin } = req.auth.user;
      const { id } = req.params;
      const { competitionName } = req.body;
      if (!hasPrivileges(isAdmin, res)) return;

      // Handle response and track error source locations
      let errMessage;
      try {
         // Update data
         let sql = `UPDATE competitions SET CompetitionName = ? WHERE ID = ? AND Username = ?`;
         errMessage = "Failed to update competition";
         const [result] = await pool.execute(sql, [
            fix(competitionName),
            fix(id),
            username,
         ]);

         // May have found no data
         errMessage = "Found no competition to update";
         if (!result.affectedRows) throw "";

         // Success!
         res.send({
            message: "Successfully updated competition",
            type: "good",
         });
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   //

   // Delete Comp
   router.delete("/:id", verifyToken, async (req, res) => {
      // Analyze request
      const { username, isAdmin } = req.auth.user;
      const { id } = req.params;
      if (!hasPrivileges(isAdmin, res)) return;

      // Handle response and track error source locations
      let errMessage;
      try {
         // Delete data
         let sql = `DELETE FROM competitions WHERE ID = ? AND Username = ?`;
         errMessage = "Delete aborted; failed to delete competition";
         const [result] = await pool.execute(sql, [fix(id), username]);

         // May have found no data
         errMessage = "Delete aborted; found no competition to delete";
         if (!result.affectedRows) throw "";

         // Success!
         res.send({
            message: "Successfully deleted ", // Displays 'Successfully deleted <CompetitionName> in Home component
            type: "good",
         });
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   return router;
};
