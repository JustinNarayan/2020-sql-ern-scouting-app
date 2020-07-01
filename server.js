/// Enable the server
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// Connect to the database
const keys = require("./keys");
const mysql = require("mysql");
const db = mysql.createConnection({
   host: keys.host,
   user: keys.user,
   password: keys.pass,
});
db.connect((err) => {
   if (err) throw err;
   console.log("MySQL Connected...");
});

// Init app
const app = express();

// Use middleware
app.use(bodyParser.json());

// Define and use routes
const comps = require("./routes/api/compRoute")(db);
app.use("/api/comps", comps);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
   // Set static folder
   app.use(express.static("client/build"));
   app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
   });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
