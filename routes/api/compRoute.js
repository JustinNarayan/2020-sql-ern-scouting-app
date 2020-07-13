/// Define API routes for comps database

const express = require("express");
const router = express.Router();
const verifyToken = require("./verifyToken");

// Create small utility functions
const fix = (str) => str.replace(/['",`\\;]/g, "\\$&");
const hasPrivileges = (isAdmin, res) => {
   if (!isAdmin) {
      res.send({
         message: "Missing admin privileges for that action",
         type: "bad",
      });
      return false;
   }
   return true;
};

/* EXPORT
   Function containing all API routes */

module.exports = (pool) => {
   /**
    * Retrieve an array of the user's competitions
    * @auth Bearer <token> (token received from login)
    */
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

         // Success!
         res.send(result);
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   /**
    * Check if a competition is valid for a user
    * @params id (competition ID int)
    * @auth Bearer <token> (token received from login)
    */
   router.get("/:id", verifyToken, async (req, res) => {
      // Analyze request
      const { id } = req.params;
      const { username } = req.auth.user;

      // Handle response and track error source locations
      let errMessage;
      try {
         /* Check if this competition is valid for this user
          */
         let sql = `SELECT * FROM competitions WHERE ID = ? AND Username = ? LIMIT 1`;
         errMessage = "Failed to contact competitions database";
         const [result] = await pool.execute(sql, [id, username]);
         errMessage = "Invalid competition for this user";
         if (!result.length) throw "";
         /* */

         // Success!
         res.send({
            valid: true,
            message: "Valid competition",
            type: "good",
            comp: result[0],
         });
      } catch (err) {
         // Send error message
         res.send({ valid: false, message: errMessage, type: "bad", err });
      }
   });

   /**
    * Create a new competition for the user
    * @auth Bearer <token> (token received from login)
    * @auth isAdmin (token must contain affirmative isAdmin property)
    */
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

   /**
    * Update the name of a competition
    * @params id (competition ID int)
    * @auth Bearer <token> (token received from login)
    * @auth isAdmin (token must contain affirmative isAdmin property)
    */
   router.patch("/:id", verifyToken, async (req, res) => {
      // Analyze request
      const { username, isAdmin } = req.auth.user;
      const { id } = req.params;
      const { competitionName } = req.body;
      if (!hasPrivileges(isAdmin, res)) return;

      // Handle response and track error source locations
      let errMessage;
      try {
         // Check if this name is taken
         let sql = `SELECT * FROM competitions WHERE Username = ? AND CompetitionName = ?`;
         errMessage = "Failed to get competitions";
         const [existsResult] = await pool.execute(sql, [
            username,
            fix(competitionName),
         ]);

         // Name may be taken
         errMessage = "That competition name is taken";
         if (existsResult.length) throw "";

         // Update data
         sql = `UPDATE competitions SET CompetitionName = ? WHERE ID = ? AND Username = ?`;
         errMessage = "Failed to update competition";
         const [updateResult] = await pool.execute(sql, [
            fix(competitionName),
            fix(id),
            username,
         ]);

         // May have found no data
         errMessage = "Found no competition to update";
         if (!updateResult.affectedRows) throw "";

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

   /**
    * Delete a competition for the user
    * @params id (competition ID int)
    * @auth Bearer <token> (token received from login)
    * @auth isAdmin (token must contain affirmative isAdmin property)
    */
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
