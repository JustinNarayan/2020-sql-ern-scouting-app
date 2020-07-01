/// Define API routes for comps collection

const express = require("express");
const router = express.Router();

module.exports = (db) => {
   // Get Comps
   router.get("/", (req, res) => {
      let sql = "DESCRIBE `competitions`";
      db.query(sql, (err, result) => {
         //if (err) throw err;
         console.log(err);
         res.send("Competitions");
      });
   });

   return router;
};
