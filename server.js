/// Enable the server
const express = require("express");
//const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Connect to the database
let keys;
try {
   keys = require("./config/keys");
} catch (err) {
   // Module does not exist
}
const mysql = require("mysql");
const db = mysql.createConnection({
   host: process.env.SQL_HOST || keys.host,
   user: process.env.SQL_USER || keys.user,
   password: process.env.SQL_PASS || keys.pass,
   database: process.env.SQL_DATABASE || keys.database,
});
db.connect((err) => {
   if (err) throw err;
   console.log("MySQL Connected...");
});

// Init app
const app = express();

// Use middleware
//app.use(cors());
app.use(bodyParser.json());

// Define and use routes
const users = require("./routes/api/userRoute")(db);
app.use("/api/users", users);
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
