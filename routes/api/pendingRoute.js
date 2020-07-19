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
    * Retrieve an array of all pending matches from a specific competition
    * @params id (competition ID int)
    * @auth Bearer <token> (token received from login)
    */
   router.get("/:id", verifyToken, async (req, res) => {
      // Analyze request
      const { username, isAdmin } = req.auth.user;
      const { id } = req.params;
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

         // Query database for matches in this competition
         sql = `SELECT * FROM pendingMatchData WHERE CompetitionID = ? ORDER BY ID ASC`;
         errMessage = "Failed to get pending match data";
         const [result] = await pool.execute(sql, [id]);

         // Success!
         res.send(result);
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   /**
    * Post a piece of pending match data to a specific competition
    * @params id (competition ID int)
    * @auth Bearer <token> (token received from login)
    * @auth isAdmin (token must contain affirmative isAdmin property)
    */
   router.post("/:id", verifyToken, async (req, res) => {
      // Analyze request
      const { username } = req.auth.user;
      const { id } = req.params;
      const {
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
         endgameScore,
         comments,
         scoutName,
      } = req.body;

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
         sql = `UPDATE pendingMatchData SET Events = ?, OuterHeatmap = ?, InnerHeatmap = ?, PickupHeatmap = ?, CrossLine = ?, BottomAuto = ?, OuterAuto = ?, InnerAuto = ?, BottomAll = ?, OuterAll = ?, InnerAll = ?, Pickups = ?, TimeDefended = ?, TimeDefending = ?, DefenseQuality = ?, TimeMal = ?, EndgameScore = ?, Comments = ?, ScoutName = ? WHERE CompetitionID = ? AND TeamNumber = ? AND MatchNumber = ?`;
         errMessage = "Failed to attempt updating existing pending match data";
         const [updateResult] = await pool.execute(sql, [
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
            endgameScore,
            fix(comments),
            fix(scoutName),
            id, // Identify where to update
            teamNumber, // Identify where to update
            fix(matchNumber), // Identify where to update
         ]);

         // Next, if no data was updated (match data was not preloaded), INSERT new data
         errMessage = "Found no competition to update";
         if (!updateResult.affectedRows) {
            sql = `INSERT INTO pendingMatchData (CompetitionID, TeamNumber, MatchNumber, RobotStation, Events, OuterHeatmap, InnerHeatmap, PickupHeatmap, CrossLine, BottomAuto, OuterAuto, InnerAuto, BottomAll, OuterAll, InnerAll, Pickups, TimeDefended, TimeDefending, DefenseQuality, TimeMal, EndgameScore, Comments, ScoutName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            errMessage = "Failed to post new pending match data";
            const [insertResult] = await pool.execute(sql, [
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
               endgameScore,
               fix(comments),
               fix(scoutName),
            ]);

            // Success!
            res.status(201).send({
               message: "Successfully posted new pending match data",
               type: "good",
            });
         } else {
            // Success!
            res.status(201).send({
               message: "Successfully updated existing pending match data",
               type: "good",
            });
         }
      } catch (err) {
         // Send error message
         res.send({ message: errMessage, type: "bad", err });
      }
   });

   return router;
};
