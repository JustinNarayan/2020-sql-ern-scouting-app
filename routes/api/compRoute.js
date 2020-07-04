/// Define API routes for comps database

const express = require("express");
const router = express.Router();
const verifyToken = require("./verifyToken");

module.exports = (db) => {
   // Select Comps
   router.get("/", verifyToken, (req, res) => {
      let sql = "SELECT * FROM competitions";
      db.query(sql, (err, rows) => {
         if (err) {
            res.status(404).send(err);
         }
         res.send(rows);
      });
   });

   // Insert Comp
   router.post("/", verifyToken, (req, res) => {
      let sql = `INSERT INTO competitions (CompetitionName) VALUES ('${req.body.competitionName}')`;
      db.query(sql, (err, rows) => {
         if (err) {
            res.status(404).send(err);
         }
         res.status(201).send();
      });
   });

   // Update Comp
   router.patch("/:id", verifyToken, (req, res) => {
      let sql = `UPDATE competitions SET CompetitionName = '${req.body.competitionName}' WHERE ID = '${req.params.id}'`;
      db.query(sql, (err) => {
         if (err) {
            res.status(404).send(err);
         }
         res.send();
      });
   });

   // Delete Comp
   router.delete("/:id", verifyToken, (req, res) => {
      let sql = `DELETE FROM competitions WHERE ID = '${req.params.id}' LIMIT 1`;
      db.query(sql, (err, result) => {
         if (err) {
            res.status(404).send(err);
         }
         if (result.affectedRows) res.send();
         else res.status(204).send();
      });
   });

   return router;
};
