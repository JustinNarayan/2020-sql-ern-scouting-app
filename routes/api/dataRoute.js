/// Define API routes for comps database

const express = require("express");
const router = express.Router();
const { format } = require("fecha");
const verifyToken = require("./verifyToken");

// Create small utility functions
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
    * Retrieve an array of all matches from a specific competition
    * @params id (competition ID int)
    * @auth Bearer <token> (token received from login)
    */
   router.get("/:id", verifyToken, async (req, res) => {
      // Analyze request
      const { username } = req.auth.user;
      const { id } = req.params;

      // Handle response and track error source locations
      let errMessage;
      try {
         /* Check if this competition is valid for this user
          */
         let sql = `SELECT * FROM competitions WHERE ID = ? AND Username = ?`;
         errMessage = "Failed to get competitions";
         const [userComp] = await pool.execute(sql, [id, username]);
         errMessage = "Invalid competition for this user";
         if (!userComp.length) throw "";
         /* */

         // Query database for matches in this competition
         sql = `SELECT * FROM matchData WHERE CompetitionID = ? ORDER BY ID ASC`;
         errMessage = "Failed to get match data";
         const [result] = await pool.execute(sql, [id]);

         // Success!
         res.send(result);
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   /**
    * Post a piece of match data to a specific competition
    * @params id (competition ID int)
    * @auth Bearer <token> (token received from login)
    * @auth isAdmin (token must contain affirmative isAdmin property)
    */
   router.post("/:id", verifyToken, async (req, res) => {
      // Analyze request
      const { username } = req.auth.user;
      const { id } = req.params;
      const {
         updated,
         teamNumber,
         matchNumber,
         robotStation,
         events,
         outerHeatmap,
         innerHeatmap,
         pickupHeatmap,
         crossLine,
         bottomAuto,
         outerAuto,
         innerAuto,
         bottom,
         outer,
         inner,
         pickups,
         timeDefended,
         timeDefending,
         defenseQuality,
         timeMal,
         endgame,
         comments,
         scoutName,
      } = req.body;
      // if (!hasPrivileges(isAdmin, res)) return;

      // Handle response and track error source locations
      let errMessage;
      try {
         /* Check if this competition is valid for this user
          */
         let sql = `SELECT * FROM competitions WHERE ID = ? AND Username = ?`;
         errMessage = "Failed to get competitions";
         const [userComp] = await pool.execute(sql, [id, username]);
         errMessage = "Invalid competition for this user";
         if (!userComp.length) throw "";
         /* */

         // First, send an UPDATE in case the match had been generated previously (Robot Station excluded)
         sql = `UPDATE matchData SET DateTime = ?, Updated = ?, Events = ?, OuterHeatmap = ?, InnerHeatmap = ?, PickupHeatmap = ?, CrossLine = ?, BottomAuto = ?, OuterAuto = ?, InnerAuto = ?, BottomAll = ?, OuterAll = ?, InnerAll = ?, Pickups = ?, TimeDefended = ?, TimeDefending = ?, DefenseQuality = ?, TimeMal = ?, Endgame = ?, Comments = ?, ScoutName = ? WHERE CompetitionID = ? AND TeamNumber = ? AND MatchNumber = ?`;
         errMessage = "Failed to attempt updating existing match data";
         const [updateResult] = await pool.execute(sql, [
            format(new Date(), "YYYY-MM-DD HH:mm:ss"), // A datetime marker
            updated,
            events,
            outerHeatmap,
            innerHeatmap,
            pickupHeatmap,
            crossLine,
            bottomAuto,
            outerAuto,
            innerAuto,
            bottom,
            outer,
            inner,
            pickups,
            timeDefended,
            timeDefending,
            defenseQuality,
            timeMal,
            endgame,
            comments,
            scoutName,
            id, // Identify where to update
            teamNumber, // Identify where to update
            matchNumber, // Identify where to update
         ]);

         // Next, if no data was updated (match data was not preloaded), INSERT new data
         errMessage = "Found no competition to update";
         if (!updateResult.affectedRows) {
            sql = `INSERT INTO matchData (DateTime, Updated, CompetitionID, TeamNumber, MatchNumber, RobotStation, Events, OuterHeatmap, InnerHeatmap, PickupHeatmap, CrossLine, BottomAuto, OuterAuto, InnerAuto, BottomAll, OuterAll, InnerAll, Pickups, TimeDefended, TimeDefending, DefenseQuality, TimeMal, Endgame, Comments, ScoutName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            errMessage = "Failed to post new match data";
            const [insertResult] = await pool.execute(sql, [
               format(new Date(), "YYYY-MM-DD HH:mm:ss"), // A datetime marker
               updated,
               id,
               teamNumber,
               matchNumber,
               robotStation,
               events,
               outerHeatmap,
               innerHeatmap,
               pickupHeatmap,
               crossLine,
               bottomAuto,
               outerAuto,
               innerAuto,
               bottom,
               outer,
               inner,
               pickups,
               timeDefended,
               timeDefending,
               defenseQuality,
               timeMal,
               endgame,
               comments,
               scoutName,
            ]);

            // Success!
            res.status(201).send({
               message: "Successfully posted new match data",
               type: "good",
            });
         } else {
            // Success!
            res.status(201).send({
               message: "Successfully updated existing match data",
               type: "good",
            });
         }
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   /**
    * Switch the competitionID of a piece of match data or changed its updated status
    * @params id (competition ID int)
    * @auth Bearer <token> (token received from login)
    * @auth isAdmin (token must contain affirmative isAdmin property)
    */
   router.patch("/:id", verifyToken, async (req, res) => {
      // Analyze request
      const { username, isAdmin } = req.auth.user;
      const { id } = req.params;
      const { teamNumber, matchNumber, newCompetitionID, updated } = req.body;
      if (!hasPrivileges(isAdmin, res)) return;

      // Handle response and track error source locations
      let errMessage;
      try {
         /* Check if this competition is valid for this user
          */
         let sql = `SELECT * FROM competitions WHERE ID = ? AND Username = ?`;
         errMessage = "Failed to get competitions";
         const [userComp] = await pool.execute(sql, [id, username]);
         errMessage = "Invalid competition for this user";
         if (!userComp.length) throw "";
         /* */

         /// Check the type of patch requested
         if (newCompetitionID) {
            // Check if new competition is valid for this user
            sql = `SELECT * FROM competitions WHERE ID = ? AND Username = ?`;
            errMessage = "Failed to get competitions";
            const [newComp] = await pool.execute(sql, [
               newCompetitionID,
               username,
            ]);
            errMessage = "Invalid competition to switch to for this user";
            if (!newComp.length) throw "";

            // Update CompetitionID variable
            sql = `UPDATE matchData SET CompetitionID = ? WHERE CompetitionID = ? AND TeamNumber = ? AND MatchNumber = ?`;
            errMessage = "Failed to attempt updating existing match data";
            const [result] = await pool.execute(sql, [
               newCompetitionID,
               id,
               teamNumber,
               matchNumber,
            ]);

            // May have found no data
            errMessage = "Found no match data to switch competitions for";
            if (!result.affectedRows) throw "";

            // Success!
            res.send({
               message: "Successfully switched competitions",
               type: "good",
            });
         } else {
            // Update Updated status
            sql = `UPDATE matchData SET Updated = ? WHERE CompetitionID = ? AND TeamNumber = ? AND MatchNumber = ?`;
            errMessage = "Failed to attempt updating existing match data";
            const [result] = await pool.execute(sql, [
               updated,
               id,
               teamNumber,
               matchNumber,
            ]);

            // May have found no data
            errMessage = `Found no match data to ${
               updated ? "reinstate" : "clear"
            }`;
            if (!result.affectedRows) throw "";

            // Success!
            res.send({
               message: `Successfully ${
                  updated ? "reinstated" : "cleared"
               } match data`,
               type: "good",
            });
         }
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   /**
    * Remove the updated status of a piece of match data
    * @params id (competition ID int)
    * @auth Bearer <token> (token received from login)
    * @auth isAdmin (token must contain affirmative isAdmin property)
    */
   router.delete("/:id", verifyToken, async (req, res) => {
      // Analyze request
      const { username, isAdmin } = req.auth.user;
      const { id } = req.params;
      const { teamNumber, matchNumber } = req.body;
      if (!hasPrivileges(isAdmin, res)) return;

      // Handle response and track error source locations
      let errMessage;
      try {
         /* Check if this competition is valid for this user
          */
         let sql = `SELECT * FROM competitions WHERE ID = ? AND Username = ?`;
         errMessage = "Failed to get competitions";
         const [userComp] = await pool.execute(sql, [id, username]);
         errMessage = "Invalid competition for this user";
         if (!userComp.length) throw "";
         /* */

         // Update Updated variable
         sql = `UPDATE matchData SET Updated = ? WHERE CompetitionID = ? AND TeamNumber = ? AND MatchNumber = ?`;
         errMessage = "Failed to attempt clearing match data";
         const [result] = await pool.execute(sql, [
            0,
            id,
            teamNumber,
            matchNumber,
         ]);

         // May have found no data
         errMessage = "Found no match data to clear";
         if (!result.affectedRows) throw "";

         // Success!
         res.send({
            message: "Successfully cleared match data",
            type: "good",
         });
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   return router;
};
